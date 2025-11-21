"""Booking repository"""
from typing import List, Optional
from datetime import date
from sqlalchemy import and_
from sqlalchemy.orm import Session
from app.domain.entities import Booking
from app.infra.database.models import BookingDB

class BookingRepository:
    """Repository for booking"""
    def __init__(self, db: Session):
        self.db = db

    def save(self, booking: Booking) -> Booking:
        """Save booking"""
        db_booking = BookingDB(
            name=booking.name,
            phone=booking.phone,
            bus_provider=booking.bus_provider,
            from_district=booking.from_district,
            to_district=booking.to_district,
            dropping_point=booking.dropping_point,
            price=booking.price,
            travel_date=booking.travel_date,
            travel_time=booking.travel_time,
            status=booking.status
        )
        self.db.add(db_booking)
        self.db.commit()
        self.db.refresh(db_booking)
        booking.id = db_booking.id
        booking.booking_date = db_booking.booking_date
        return booking

    def find_by_id(self, booking_id: int) -> Optional[Booking]:
        """Find booking by id"""
        db_booking = self.db.query(BookingDB).filter(
            BookingDB.id == booking_id
        ).first()

        if not db_booking:
            return None

        return self._to_entity(db_booking)

    def find_by_phone(self, phone: str) -> List[Booking]:
        """Find booking by phone number"""
        db_bookings = self.db.query(BookingDB).filter(
            BookingDB.phone == phone,
            BookingDB.status == "confirmed"
        ).all()

        return [self._to_entity(b) for b in db_bookings]

    def check_duplicate(
        self,
        phone: str,
        travel_date: date,
        travel_time: str,
        bus_provider: str,
        from_district: str,
        to_district: str,
        dropping_point: str
    ) -> bool:
        """
        Check if a booking with same details already exists.
        Prevents duplicate bookings for same user, date, route, and provider.
        """
        existing = self.db.query(BookingDB).filter(
            and_(
                BookingDB.phone == phone,
                BookingDB.travel_date == travel_date,
                BookingDB.travel_time == travel_time,
                BookingDB.bus_provider == bus_provider,
                BookingDB.from_district == from_district,
                BookingDB.to_district == to_district,
                BookingDB.dropping_point == dropping_point,
                BookingDB.status == "confirmed"
            )
        ).first()
        return existing is not None

    def update(self, booking: Booking) -> Booking:
        """Update booking"""
        db_booking = self.db.query(BookingDB).filter(
            BookingDB.id == booking.id
        ).first()

        db_booking.status = booking.status
        self.db.commit()
        return booking

    def _to_entity(self, db_booking: BookingDB) -> Booking:
        return Booking(
            id=db_booking.id,
            name=db_booking.name,
            phone=db_booking.phone,
            bus_provider=db_booking.bus_provider,
            from_district=db_booking.from_district,
            to_district=db_booking.to_district,
            dropping_point=db_booking.dropping_point,
            price=db_booking.price,
            travel_date=db_booking.travel_date,
            travel_time=db_booking.travel_time,
            booking_date=db_booking.booking_date,
            status=db_booking.status
        )
