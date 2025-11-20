from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Booking:
    name: str
    phone: str
    bus_provider: str
    from_district: str
    to_district: str
    dropping_point: str
    price: float
    travel_date: str
    travel_time: str
    id: Optional[int] = None
    booking_date: Optional[datetime] = None
    status: str = "confirmed"
    
    def cancel(self):
        if self.status == "canceled":
            raise ValueError("Booking already canceled")
        self.status = "canceled"
        
@dataclass
class BusRoute:
    provider: str
    from_district: str
    to_district: str
    dropping_point: str
    price: float

@dataclass
class Provider:
    name: str
    coverage_districts: list[str]