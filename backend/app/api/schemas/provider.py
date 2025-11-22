"""Validation for bus provider related query and response"""
from typing import Optional
from pydantic import BaseModel

class ProviderQuery(BaseModel):
    """Validate provider query"""
    query: str
    provider_name: Optional[str] = None

class ProviderResponse(BaseModel):
    """Validate provider response"""
    answer: dict
    provider: str
    confidence: float
    sources: list
