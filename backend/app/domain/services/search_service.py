"""Service for searching"""

from typing import List, Optional
from app.domain.entities import BusRoute
from app.domain.exceptions import RouteNotFound

class SearchService:
    """Search buses"""

    def __init__(self, bus_repo):
        self.bus_repo = bus_repo

    def search_routes(
        self,
        from_district: str,
        to_district: str,
        max_price: Optional[float] = None
    ) -> List[BusRoute]:
        """Search routes for available buses"""
        routes = self.bus_repo.search_routes(
            from_district,
            to_district,
            max_price
        )

        if not routes:
            raise RouteNotFound(from_district, to_district)

        return routes

    def get_districts(self) -> List[str]:
        """Get all districts"""
        return self.bus_repo.get_districts()

    def get_providers(self) -> List[dict]:
        """Get all providers"""
        return self.bus_repo.get_providers()
