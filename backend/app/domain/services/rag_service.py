"""RAG service"""

from typing import Optional
from app.domain.exceptions import ProviderNotFound

class RAGService:
    """Handle RAG-based queries"""

    def __init__(self, provider_repo):
        self.provider_repo = provider_repo

    def query_provider(self, query: str, provider_name: Optional[str] = None):
        """Query provider info using RAG"""
        results = self.provider_repo.semantic_search(query, provider_name)

        if not results:
            raise ProviderNotFound("No information found")

        top_result = results[0]

        return {
            "answer": top_result['contact_info'],
            "provider": top_result['provider'],
            "confidence": top_result['similarity'],
            "sources": results[:3]
        }

    def get_provider_info(self, provider_name: str) -> dict:
        """Get specific provider details"""
        return self.query_provider(
            "contact information",
            provider_name
        )
