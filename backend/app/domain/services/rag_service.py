"""Enhanced RAG service with better query understanding"""
import re
from typing import Dict, Optional, List
from app.config import get_settings

settings = get_settings()

class RAGService:
    """Handle RAG-based queries with intelligent routing"""

    def __init__(self, provider_repo, bus_repo):
        self.provider_repo = provider_repo
        self.bus_repo = bus_repo

        # Cache providers for faster lookups
        self._provider_names_cache = None
        self._districts_cache = None

    @property
    def provider_names(self) -> List[str]:
        """Cached provider names"""
        if self._provider_names_cache is None:
            self._provider_names_cache = [p['name'] for p in self.bus_repo.get_providers()]
        return self._provider_names_cache

    @property
    def districts(self) -> List[str]:
        """Cached district names"""
        if self._districts_cache is None:
            self._districts_cache = self.bus_repo.get_districts()
        return self._districts_cache

    def query(self, query: str) -> Dict:
        """
        Unified query handler with intelligent routing.
        
        Routes queries to appropriate handlers:
        - RAG for provider information (contact, policies)
        - Database for route/price searches
        - Hybrid for cancellation workflows
        """
        query = query.lower()

        # 1. Cancellation queries
        if self._is_cancellation_query(query):
            return self._handle_cancellation_query(query)

        # 2. Provider information queries (USE RAG)
        if self._is_provider_info_query(query):
            return self._handle_rag_contact_query(query)

        # 3. Route/price queries (USE DATABASE)
        if self._is_route_query(query):
            return self._handle_route_query(query)

        # 4. Default: Try RAG first, then inform user
        return self._handle_ambiguous_query(query)

    def _is_cancellation_query(self, query: str) -> bool:
        """Detect cancellation intent"""
        return any(word in query for word in ['cancel', 'cancellation', 'refund'])

    def _is_provider_info_query(self, query: str) -> bool:
        """Detect if query is about provider information (RAG territory)"""
        provider_keywords = [
            'contact', 'phone', 'email', 'address', 'call', 'reach',
            'privacy', 'policy', 'terms', 'details', 'information',
            'located', 'office', 'website', 'number'
        ]

        route_keywords = ['from', 'to', 'between', 'route', 'price', 'taka', 'fare']

        has_provider_keyword = any(word in query for word in provider_keywords)
        has_route_keyword = any(word in query for word in route_keywords)
        has_provider_name = any(prov.lower() in query for prov in self.provider_names)

        # Provider info if:
        # - Has provider keywords AND (has provider name OR no route keywords)
        # - Has provider name but no route keywords
        return (has_provider_keyword and (has_provider_name or not has_route_keyword)) or \
               (has_provider_name and not has_route_keyword)

    def _is_route_query(self, query: str) -> bool:
        """Detect if query is about routes/prices"""
        route_keywords = [
            'bus', 'route', 'from', 'to', 'between', 'operating',
            'price', 'taka', 'fare', 'cost', 'cheap', 'under', 'over',
            'travel', 'available'
        ]
        return any(word in query for word in route_keywords)

    def _handle_rag_contact_query(self, query: str) -> Dict:
        """
        Handle provider information queries using RAG.
        This is the CORE RAG functionality.
        """
        # Extract provider name if mentioned
        provider_name = self._extract_provider_name(query)

        try:
            # Use semantic search with LangChain
            results = self.provider_repo.semantic_search(
                query=query,
                provider_name=provider_name,
                k=3  # Get top 3 most relevant chunks
            )

            if not results:
                return self._no_results_response(provider_name)

            # Build answer from RAG results
            return self._format_rag_response(query, results)

        except Exception as e:
            print(f"RAG error: {e}")
            return self._error_response(provider_name)

    def _format_rag_response(self, query: str, results: List[Dict]) -> Dict:
        """Format response based on query intent and RAG results"""
        top_result = results[0]
        contact = top_result['contact_info']

        # Determine what user is asking for
        if any(word in query for word in ['phone', 'call', 'contact', 'number']):
            answer = self._format_contact_answer(contact)
        elif any(word in query for word in ['address', 'location', 'where', 'office']):
            answer = self._format_address_answer(contact)
        elif any(word in query for word in ['email', 'mail']):
            answer = self._format_email_answer(contact)
        elif any(word in query for word in ['privacy', 'policy', 'terms']):
            answer = self._format_policy_answer(top_result)
        else:
            # General query - provide comprehensive info
            answer = self._format_comprehensive_answer(contact)

        return {
            "answer": answer,
            "query_type": "provider_info_rag",
            "provider": contact['provider'],
            "similarity_score": top_result.get('similarity', 0),
            "sources": [r['provider'] for r in results],
            "rag_used": True  # Flag to show RAG was used
        }

    def _format_contact_answer(self, contact: Dict) -> str:
        """Format contact information answer"""
        answer = f"📞 {contact['provider']} Contact Information:\n\n"
        if contact.get('phone'):
            answer += f"Phone: {contact['phone']}\n"
        if contact.get('email'):
            answer += f"Email: {contact['email']}\n"
        if not contact.get('phone') and not contact.get('email'):
            answer += "Contact details not available in records.\n"
        return answer.strip()

    def _format_address_answer(self, contact: Dict) -> str:
        """Format address answer"""
        answer = f"📍 {contact['provider']} Location:\n\n"
        if contact.get('address'):
            answer += f"Address: {contact['address']}\n"
        else:
            answer += "Address not available in records.\n"
        return answer.strip()

    def _format_email_answer(self, contact: Dict) -> str:
        """Format email answer"""
        answer = f"📧 {contact['provider']} Email:\n\n"
        if contact.get('email'):
            answer += f"Email: {contact['email']}\n"
        else:
            answer += "Email not available in records.\n"
        return answer.strip()

    def _format_policy_answer(self, result: Dict) -> str:
        """Format privacy policy answer"""
        provider = result['contact_info']['provider']
        content = result['content']

        # Extract policy-related content
        lines = content.split('\n')
        policy_lines = [
            line.strip() for line in lines
            if any(word in line.lower() for word in ['privacy', 'policy', 'data', 'collect'])
            and line.strip()
        ]

        answer = f"🔒 {provider} Privacy Policy:\n\n"
        if policy_lines:
            answer += '\n'.join(policy_lines[:5])  # Top 5 relevant lines
        else:
            answer += "Privacy policy details not available. Please check their website.\n"

        if result['contact_info'].get('website'):
            answer += f"\n\nWebsite: {result['contact_info']['website']}"

        return answer.strip()

    def _format_comprehensive_answer(self, contact: Dict) -> str:
        """Format comprehensive provider information"""
        answer = f"ℹ️ {contact['provider']} Information:\n\n"

        if contact.get('address'):
            answer += f"📍 Address: {contact['address']}\n"
        if contact.get('phone'):
            answer += f"📞 Phone: {contact['phone']}\n"
        if contact.get('email'):
            answer += f"📧 Email: {contact['email']}\n"
        if contact.get('website'):
            answer += f"🌐 Website: {contact['website']}\n"

        return answer.strip()

    def _handle_route_query(self, query: str) -> Dict:
        """Handle route and price queries using database"""
        # Extract districts
        from_dist, to_dist = self._extract_districts(query)

        # Extract price constraint
        max_price = self._extract_price(query)

        if not from_dist or not to_dist:
            return {
                "answer": f"Please specify both origin and destination. Available districts: {', '.join(self.districts)}",
                "query_type": "route_search",
                "available_districts": self.districts
            }

        # Search routes
        routes = self.bus_repo.search_routes(from_dist, to_dist, max_price)

        if not routes:
            answer = f"No buses found from {from_dist} to {to_dist}"
            if max_price:
                answer += f" under {max_price} taka"
            return {
                "answer": answer,
                "query_type": "route_search",
                "from": from_dist,
                "to": to_dist,
                "results": []
            }

        # Format response based on query intent
        providers = list(set([r.provider for r in routes]))

        if max_price or any(word in query for word in ['price', 'taka', 'fare', 'cost', 'cheap']):
            # Price-focused query
            answer = f"🚌 Found {len(routes)} buses from {from_dist} to {to_dist}"
            if max_price:
                answer += f" under ৳{max_price}"
            answer += ":\n\n"

            for i, r in enumerate(routes[:10], 1):  # Top 10
                answer += f"{i}. {r.provider}: {r.dropping_point} - ৳{r.price}\n"

            return {
                "answer": answer.strip(),
                "query_type": "price_search",
                "from": from_dist,
                "to": to_dist,
                "max_price": max_price,
                "results": [{"provider": r.provider, "price": r.price, "route": r.dropping_point} for r in routes]
            }
        else:
            # Provider listing query
            answer = f"🚌 Bus providers from {from_dist} to {to_dist}:\n\n"
            answer += ", ".join(providers)
            answer += f"\n\nTotal routes available: {len(routes)}"

            return {
                "answer": answer,
                "query_type": "route_search",
                "from": from_dist,
                "to": to_dist,
                "providers": providers,
                "total_routes": len(routes)
            }

    def _handle_cancellation_query(self, query: str) -> Dict:
        """Handle booking cancellation queries"""
        from_dist, to_dist = self._extract_districts(query)
        date_info = self._extract_date(query)

        answer = "📋 To cancel your booking:\n\n"
        answer += "Use: POST /api/bookings/cancel\n\n"
        answer += "Required information:\n"
        answer += "• Phone number\n"
        answer += "• Travel date\n"
        answer += "• Bus provider\n"
        answer += "• Origin and destination districts\n"

        if from_dist and to_dist:
            answer += f"\nYour route: {from_dist} → {to_dist}"
        if date_info:
            answer += f"\nTravel date: {date_info}"

        return {
            "answer": answer,
            "query_type": "cancellation",
            "endpoint": "/api/bookings/cancel",
            "from": from_dist,
            "to": to_dist,
            "date": date_info
        }

    def _handle_ambiguous_query(self, query: str) -> Dict:
        """Handle queries that don't fit clear categories"""
        # Try RAG as default

        results = self.provider_repo.semantic_search(query, k=1)
        if results and results[0].get('similarity', 0) > 0.5:
            return self._format_rag_response(query.lower(), results)


        return {
            "answer": "I can help you with:\n\n" +
                     "🚌 Bus routes and prices\n" +
                     "📞 Provider contact information\n" +
                     "📋 Booking cancellations\n\n" +
                     f"Available providers: {', '.join(self.provider_names)}\n" +
                     f"Available districts: {', '.join(self.districts)}",
            "query_type": "help",
            "available_providers": self.provider_names,
            "available_districts": self.districts
        }

    # Helper methods
    def _extract_provider_name(self, query: str) -> Optional[str]:
        """Extract provider name from query"""
        for provider in self.provider_names:
            if provider.lower() in query:
                return provider
        return None
    
    def _extract_districts(self, query: str) -> tuple:
        """Extract from and to districts"""
        query_normalized = query.replace('chittagong', 'chattogram')
        from_dist = None
        to_dist = None
        
        for dist in self.districts:
            if dist.lower() in query_normalized:
                if from_dist is None:
                    from_dist = dist
                elif to_dist is None:
                    to_dist = dist
        
        return from_dist, to_dist
    
    def _extract_price(self, query: str) -> Optional[int]:
        """Extract price constraint"""
        price_match = re.search(r'(\d+)\s*taka', query)
        return int(price_match.group(1)) if price_match else None

    def _extract_date(self, query: str) -> Optional[str]:
        """Extract date information"""
        date_match = re.search(
            r'(\d+)\s*(st|nd|rd|th)?\s*(january|february|march|april|may|june|july|august|september|october|november|december)',
            query
        )
        return date_match.group(0) if date_match else None

    def _no_results_response(self, provider_name: Optional[str]) -> Dict:
        """Response when RAG finds no results"""
        if provider_name:
            answer = f"No information found for {provider_name}."
        else:
            answer = "No matching information found. Please specify a provider."

        return {
            "answer": answer + f"\n\nAvailable providers: {', '.join(self.provider_names)}",
            "query_type": "provider_info_rag",
            "available_providers": self.provider_names,
            "rag_used": True
        }

    def _error_response(self, provider_name: Optional[str]) -> Dict:
        """Response when RAG encounters error"""
        return {
            "answer": "Unable to retrieve information at the moment. Please try again.",
            "query_type": "error",
            "rag_used": True
        }
