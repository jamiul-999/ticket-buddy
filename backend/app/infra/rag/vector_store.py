"""Store vector embeddings"""
from typing import List, Optional
import os
#from langchain_community.vectorstores import Chroma
from langchain_chroma import Chroma
from langchain_community.docstore.document import Document
from langchain_huggingface import HuggingFaceEmbeddings
from app.config import get_settings

settings = get_settings()

class VectorStoreService:
    """Langchain chromaDB vector store for provider documents"""

    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL,
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )

        self.persist_directory = "/app/data/chroma_db"
        os.makedirs(self.persist_directory, exist_ok=True)

        self.vector_store = Chroma(
            persist_directory=self.persist_directory,
            embedding_function=self.embeddings,
            collection_name="provider_docs"
        )

    def index_documents(self, docs_path: str):
        """Index all provided bus documents"""
        # pylint: disable=protected-access
        if self.vector_store._collection.count() > 0:
            print("Documents already indexed!")

        if not os.path.exists(docs_path):
            print(f"Documents path not found: {docs_path}")
            return

        print("Indexing provider documents with Langchain...")

        documents = []

        for filename in os.listdir(docs_path):
            if filename.endswith('.txt'):
                provider_name = filename.replace('_', ' ').replace('.txt', '').title()
                filepath = os.path.join(docs_path, filename)

                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                doc = Document(
                    page_content=content,
                    metadata={
                        'provider': provider_name,
                        'source': filename
                    }
                )
                documents.append(doc)
                print(f"Loaded: {provider_name}")

        if documents:
            self.vector_store.add_documents(documents)
            print(f"Indexed {len(documents)} documents!")

    def similarity_search(
        self,
        query: str,
        provider_name: Optional[str] = None,
        k: int = 3
    ) -> List[tuple]:
        """Perform similarity search"""

        if provider_name:
            filter_dict = {"provider": {"$eq": provider_name}}
            results = self.vector_store.similarity_search_with_score(
                query,
                k=k,
                filter=filter_dict
            )
        else:
            results = self.vector_store.similarity_search_with_score(query, k=k)
        return results

    def get_retriever(self, k: int = 3):
        """Get a langchain retriever"""
        return self.vector_store.as_retriever(
            search_type="similarity",
            search_kwargs={"k": k}
        )
