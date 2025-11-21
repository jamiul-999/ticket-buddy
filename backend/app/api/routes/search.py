"""Search route"""
from typing import List
from fastapi import APIRouter, HTTPException
from app.infra.repos.bus_repo import BusRepository
from app.domain.services.search_service import SearchService
from app.api.schemas.search import SearchRequest, RouteResponse
from app.domain.exceptions import RouteNotFound

router = APIRouter(prefix="/search", tags=["Search"])

@router.post("", response_model=List[RouteResponse])
def search_buses(request: SearchRequest):
    """Search for available buses"""
    try:
        repo = BusRepository()
        service = SearchService(repo)
        routes = service.search_routes(
            request.from_district,
            request.to_district,
            request.max_price
        )
        return routes
    except RouteNotFound as e:
        raise HTTPException(status_code=404, detail=str(e)) from e

@router.get("/districts")
def get_districts():
    """Get all districts"""
    repo = BusRepository
    service = SearchService(repo)
    return service.get_districts()

@router.get("/providers")
def get_providers():
    """Get all bus service providers"""
    repo = BusRepository()
    service = SearchService(repo)
    return service.get_providers()
