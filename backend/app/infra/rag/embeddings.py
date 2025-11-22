"""Create embeddings"""
from langchain_community.embeddings import HuggingFaceEmbeddings
from app.config import get_settings

settings = get_settings()

class EmbeddingService:
    """Langchain-based embedding service"""

    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL,
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )

    def embed(self, text: str) -> list:
        """Generate embedding for single text"""
        return self.embeddings.embed_query(text)

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        """Generate embeddings for multiple documents"""
        return self.embeddings.embed_documents(texts)
