from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.infra.rag.vector_store import VectorStoreService
from app.infra.repos.provider_repo import ProviderRepository
from app.infra.repos.bus_repo import BusRepository
from app.domain.services.rag_service import RAGService

router = APIRouter(prefix="/query", tags=["RAG Query"])

class QueryRequest(BaseModel):
    query: str

_vector_store = None
_provider_repo = None
_bus_repo = None
_rag_service = None

def get_rag_service():
    global _vector_store, _provider_repo, _bus_repo, _rag_service

    if _rag_service is None:
        _vector_store = VectorStoreService()
        _provider_repo = ProviderRepository(_vector_store)
        _bus_repo = BusRepository()
        _rag_service = RAGService(_provider_repo, _bus_repo)

    return _rag_service

@router.post("")
def query_rag(request: QueryRequest):
    """Unified RAG endpoint - handles ALL queries"""
    try:
        service = get_rag_service()
        result = service.query(request.query)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
