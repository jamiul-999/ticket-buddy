"""RAG service"""
import re
from app.config import get_settings

settings = get_settings()

class RAGService:
    """Handle RAG-based queries"""

    def __init__(self, provider_repo, bus_repo):
        self.provider_repo = provider_repo
        self.bus_repo = bus_repo

    def query(self, query: str) -> dict:
        """Handle queries"""
        query_lower = query.lower()

        if any(word in query_lower for word in ['price', 'taka', 'fare',
                                                'cheap', 'under', 'over', 'cost']):
            # Price-related query
            return self._handle_price_query(query_lower)

        elif any(word in query_lower for word in ['from', 'to', 'route',
                                                  'bus', 'between', 'travel']):
            # Route query
            return self._handle_route_query(query_lower)

        elif any(word in query_lower for word in ['contact', 'phone', 'email',
                                                  'address', 'details', 'reach']):
            # Provider contact query
            return self._handle_contact_query(query, query_lower)
        else:
            return self._handle_contact_query(query, query_lower)

    def _handle_price_query(self, query_lower: str) -> dict:
        """Handle price/fare queries"""
        # Extract price if mentioned
        price_match = re.search(r'(\d+)\s*taka', query_lower)
        max_price = int(price_match.group(1)) if price_match else None

        # Extract districts
        districts = self.bus_repo.get_districts()
        from_dist = None
        to_dist = None

        for dist in districts:
            if dist.lower() in query_lower:
                if from_dist is None:
                    from_dist = dist
                elif to_dist is None:
                    to_dist = dist

        if from_dist and to_dist:
            routes = self.bus_repo.search_routes(from_dist, to_dist, max_price)

            if routes:
                route_text = f"Found {len(routes)} buses:\n"
                for r in routes:
                    route_text += f"- {r.provider}: {r.from_district} to {r.to_district} ({r.dropping_point}) - ৳{r.price}\n"

                return {
                    "answer": route_text,
                    "query_type": "price_search",
                    "results": [{"provider": r.provider, "price": r.price, "dropping_point": r.dropping_point} for r in routes]
                }
            else:
                return {
                    "answer": f"No buses found from {from_dist} to {to_dist}" + (f" under {max_price} taka" if max_price else ""),
                    "query_type": "price_search",
                    "results": []
                }

        return {"answer": "Please specify origin and destination districts", "query_type": "price_search"}

    def _handle_route_query(self, query_lower: str) -> dict:
        """Handle route queries"""
        districts = self.bus_repo.get_districts()
        from_dist = None
        to_dist = None

        for dist in districts:
            if dist.lower() in query_lower:
                if from_dist is None:
                    from_dist = dist
                elif to_dist is None:
                    to_dist = dist

        if from_dist and to_dist:
            routes = self.bus_repo.search_routes(from_dist, to_dist)
            providers = list(set([r.provider for r in routes]))

            if providers:
                answer = f"Bus providers from {from_dist} to {to_dist}: {', '.join(providers)}"
                return {
                    "answer": answer,
                    "query_type": "route_search",
                    "providers": providers,
                    "routes": [{"provider": r.provider, "price": r.price} for r in routes]
                }
            else:
                return {
                    "answer": f"No buses found from {from_dist} to {to_dist}",
                    "query_type": "route_search"
                }

        return {"answer": "Please specify origin and destination", "query_type": "route_search"}

    def _handle_contact_query(self, query: str, query_lower: str) -> dict:
        """Handle provider contact queries using vector search"""
        # Extract provider name if mentioned
        providers = [p['name'] for p in self.bus_repo.get_providers()]
        provider_name = None

        for prov in providers:
            if prov.lower() in query_lower:
                provider_name = prov
                break

        # Use semantic search
        results = self.provider_repo.semantic_search(query, provider_name, k=1)

        if results:
            top = results[0]
            contact = top['contact_info']

            answer = f"{contact['provider']} Contact Details:\n"
            if contact.get('phone'):
                answer += f"Phone: {contact['phone']}\n"
            if contact.get('email'):
                answer += f"Email: {contact['email']}\n"
            if contact.get('address'):
                answer += f"Address: {contact['address']}\n"
            if contact.get('website'):
                answer += f"Website: {contact['website']}\n"

            return {
                "answer": answer.strip(),
                "query_type": "provider_contact",
                "contact_info": contact
            }
        return {"answer": "Provider information not found", "query_type": "provider_contact"}
