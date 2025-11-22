from typing import List, Optional
from app.infra.rag.vector_store import VectorStoreService
from app.config import get_settings

settings = get_settings()

class ProviderRepository:
    """Repository for provider information using Langchain"""

    def __init__(self, vector_store: VectorStoreService):
        self.vector_store = vector_store
        self.vector_store.index_documents(settings.PROVIDER_DOCS_PATH)

    def semantic_search(
        self,
        query: str,
        provider_name: Optional[str] = None,
        k: int = 3
    ) -> List[dict]:
        """RAG-based semantic search using langchain"""

        results = self.vector_store.similarity_search(query, provider_name, k)

        formatted_results = []
        for doc, score in results:
            contact_info = self._extract_contact_info(
                doc.page_content,
                doc.metadata['provider']
            )

            formatted_results.append({
                'provider': doc.metadata['provider'],
                'content': doc.page_content,
                'similarity': float(1 - score),
                'contact_info': contact_info,
                'source': doc.metadata.get('source', '')
            })
        return formatted_results

    def _extract_contact_info(self, content: str, provider: str) -> dict:
        """Extract structured contact information from document content"""
        lines = content.split('\n')
        info = {
            'provider': provider,
            'address': '',
            'phone': '',
            'email': '',
            'website': ''
        }

        for line in lines:
            line = line.strip()
            if 'Address:' in line or 'Official Address:' in line:
                info['address'] = line.split(':', 1)[1].strip()
            elif 'Contact' in line or 'Phone' in line or 'Tel:' in line:
                info['phone'] = line.split(':', 1)[1].strip() if ':' in line else line
            elif 'Email:' in line:
                info['email'] = line.split(':', 1)[1].strip()
            elif 'Link:' in line or 'website' in line.lower():
                info['website'] = line.split(':', 1)[1].strip() if ':' in line else ''
        return info

    def get_retriever(self, k: int = 3):
        """Get langchain retriever for RAG chains"""
        return self.vector_store.get_retriever(k)
