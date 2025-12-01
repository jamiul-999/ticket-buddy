from fastapi import APIRouter, HTTPException, status, Depends
from app.infra.rag.vector_store import VectorStoreService
from app.infra.repos.provider_repo import ProviderRepository
from app.infra.repos.bus_repo import BusRepository
from app.domain.services.rag_service import RAGService
from app.api.schemas.provider import ProviderQuery, ProviderResponse
from app.domain.exceptions import (
    ProviderNotFound,
    ProviderException,
    ProviderInformationNotAvailable,
    RAGQueryFailed
)

router = APIRouter(prefix="/providers", tags=["Providers"])

# Initialize langchain components

_vector_store = None
_provider_repo = None

def get_provider_repo() -> ProviderRepository:
    """Get provider repository with langchain vector store"""
    global _vector_store, _provider_repo

    if _provider_repo is None:
        _vector_store = VectorStoreService()
        _provider_repo = ProviderRepository(_vector_store)

    return _provider_repo

def get_bus_repo() -> BusRepository:
    """Initialize bus repo"""
    global _bus_repo

    if _bus_repo is None:
        _bus_repo = BusRepository()

    return _bus_repo

def get_rag_service(
    provider_repo: ProviderRepository = Depends(get_provider_repo),
    bus_repo: BusRepository = Depends(get_bus_repo)
) -> RAGService:
    """Provide RAG service with initialized repos"""
    return RAGService(provider_repo, bus_repo)

@router.post("/query", response_model=ProviderResponse)
def query_provider(
    query: ProviderQuery,
    service: RAGService = Depends(get_rag_service)
):
    """Query provider information using langchain RAG"""
    try:
        return service.query(query.query)
    except ProviderNotFound as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": "Provider Not Found",
                "message": str(e),
                "details": e.details
            }
        ) from e
    except ProviderInformationNotAvailable as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": "Information Not Available",
                "message": str(e),
                "details": e.details
            }
        ) from e
    except RAGQueryFailed as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "Query Failed",
                "message": str(e),
                "details": e.details
            }
        ) from e
    except ProviderException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "Provider Error", "message": str(e)}
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Internal Server Error",
                "message": "An unexpected error occurred while processing your query"
            }
        ) from e

@router.get("/{provider_name}")
def get_provider(
    provider_name: str,
    provider_repo: ProviderRepository = Depends(get_provider_repo)
):
    """Get provider details using langchain RAG"""
    try:
        result = provider_repo.get_provider(provider_name)
        if not result:
            raise ProviderNotFound(provider_name)
        return result

    except (ProviderNotFound, ProviderInformationNotAvailable) as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": "Provider Not Found",
                "message": str(e),
                "details": e.details if hasattr(e, 'details') else {}
            }
        ) from e
    except ProviderException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "Provider Error", "message": str(e)}
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Internal Server Error"}
        ) from e
