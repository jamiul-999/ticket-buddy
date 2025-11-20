"""Create booking model"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime
from app.infra.database.connection import Base

class BookingDB(Base):
    """DB model for booking"""
    __tablename__="bookings"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False, index=True)
    bus_provider = Column(String, nullable=False)
    from_district = Column(String, nullable=False)
    to_district = Column(String, nullable=False)
    dropping_point = Column(String, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    travel_date = Column(Date, nullable=False)
    travel_time = Column(String, nullable=False)
    booking_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="confirmed", index=True)
