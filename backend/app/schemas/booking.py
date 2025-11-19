from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class BookingCreate(BaseModel):
    name: str = Field(..., min_length=2)
    phone: str = field(..., min_length=11, max_length=15)
    bus_provider: str
    from_district: str
    to_district: str
    dropping_point: str
    price: float
    travel_date: str
    travel_time: str
    
class BookingResponse(BaseModel):
    id: int
    name: str
    phone: str
    bus_provider: str
    from_district: str
    to_district: str
    dropping_point: str
    price: float
    traveL_date: str
    travel_time: str
    booking_date: datetime
    status: str