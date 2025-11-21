"""Pydantic validation for search"""
from typing import Optional
from pydantic import BaseModel

class SearchRequest(BaseModel):
    """Search request validation"""
    from_district: str
    to_district: str
    max_price: Optional[float] = None

class RouteResponse(BaseModel):
    """Route response validation"""
    provider: str
    from_district: str
    to_district: str
    dropping_point: str
    price: float
