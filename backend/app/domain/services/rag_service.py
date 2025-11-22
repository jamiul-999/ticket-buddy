"""RAG service"""

from typing import Optional
from app.domain.exceptions import (
    ProviderNotFound,
    ProviderInformationNotAvailable,
    RAGQueryFailed
)

class RAGService:
    """Handle RAG-based queries"""

    def __init__(self, provider_repo):
        self.provider_repo = provider_repo
        self.route_keywords = [
            'bus', 'route', 'price', 'taka', 'from', 'to', 'under', 'over', 
            'cheap', 'fare', 'schedule', 'time', 'departure', 'arrival',
            'seat', 'ticket', 'booking', 'cost', 'amount', 'district'
        ]

    def query_provider(self, query: str, provider_name: Optional[str] = None):
        """Query provider info using RAG"""
        if not query or len(query.strip()) < 3:
            raise RAGQueryFailed(query, "Query must be at least 3 characters")

        if provider_name and len(provider_name.strip()) < 2:
            raise ProviderNotFound(provider_name)

        query_lower = query.lower()

        if any(keyword in query_lower for keyword in self.route_keywords):
            # This is a route query, not a provider info query
            return {
                "error": "Wrong endpoint",
                "message": "This question is about bus routes and prices. Please use the search endpoint instead.",
                "correct_endpoint": "POST /api/search",
                "example": {
                    "from_district": "Dhaka",
                    "to_district": "Rajshahi",
                    "max_price": 500
                },
                "hint": "Use /api/providers/query only for provider contact information (phone, email, address)"
            }

        try:
            results = self.provider_repo.semantic_search(query, provider_name)

            if not results:
                if provider_name:
                    raise ProviderInformationNotAvailable(provider_name)
                else:
                    raise RAGQueryFailed(query, "No relevant information found")

            top_result = results[0]

            return {
                "answer": top_result.get('contact_info', {}),
                "provider": top_result['provider'],
                "confidence": abs(top_result['similarity']),
                "sources": results[:3]
            }
        except (ProviderNotFound, ProviderInformationNotAvailable, RAGQueryFailed):
            raise
        except Exception as e:
            raise RAGQueryFailed(query, f"Unexpected error: {str(e)}")

    def get_provider_info(self, provider_name: str) -> dict:
        """Get specific provider details"""
        if not provider_name or len(provider_name.strip()) < 2:
            raise ProviderNotFound(provider_name)

        try:
            return self.query_provider(
                "contact information address phone email website",
                provider_name
            )
        except RAGQueryFailed:
            raise ProviderInformationNotAvailable(provider_name)
