"""Repository for available buses"""
import json
from typing import List, Optional
from app.domain.entities import BusRoute
from app.config import get_settings

settings = get_settings()

class BusRepository:
    """Repository class for buses"""
    def __init__(self):
        with open(settings.BUS_DATA_PATH, 'r', encoding='utf-8') as f:
            self.data = json.load(f)

    def get_districts(self) -> List[str]:
        """Get districts available to bus providers"""
        return [d['name'] for d in self.data['districts']]

    def get_providers(self) -> List[dict]:
        """Get all the bus providers"""
        return self.data['bus_providers']

    def search_routes(
        self,
        from_district: str,
        to_district: str,
        max_price: Optional[float] = None
    ) -> List[BusRoute]:
        """Search available routes"""
        routes = []

        to_dist = next(
            (d for d in self.data['districts'] if d['name'] == to_district),
            None
        )

        if not to_dist:
            return routes

        for provider in self.data['bus_providers']:
            if (from_district in provider['coverage_districts'] and
                to_district in provider['coverage_districts']):

                for point in to_dist['dropping_points']:
                    if max_price is None or point['price'] <= max_price:
                        routes.append(BusRoute(
                            provider=provider['name'],
                            from_district=from_district,
                            to_district=to_district,
                            dropping_point=point['name'],
                            price=point['price']
                        ))
        return routes
