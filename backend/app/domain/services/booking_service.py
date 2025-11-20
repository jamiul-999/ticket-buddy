"""Booking service to create, get and cancel bookings"""
from typing import List
from app.domain.entities import Booking
from app.domain.exceptions import BookingNotFound, InvalidBooking

class BookingService:
    """Create, get and cancel Booking """
    def __init__(self, booking_repo):
        self.booking_repo = booking_repo

    def create_booking(self, data: dict) -> Booking:
        """Create booking"""
        if not data.get('name') or not data.get('phone'):
            raise InvalidBooking("Name and phone number are required")
        if len(data.get('phone', '')) < 11:
            raise InvalidBooking("Invalid phone number!")

        booking = Booking(**data)
        return self.booking_repo.save(booking)

    def get_bookings_by_phone(self, phone: str) -> List[Booking]:
        """Get bookings via phone number"""
        return self.booking_repo.find_by_phone(phone)

    def cancel_booking(self, booking_id: int) -> Booking:
        """Cancel a booking"""
        booking = self.booking_repo.find_by_id(booking_id)
        if not booking:
            raise BookingNotFound(f"Booking {booking_id} not found")

        booking.cancel()
        return self.booking_repo.update(booking)
