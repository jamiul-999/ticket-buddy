"""Booking service to create, get and cancel bookings"""
from typing import List
import re
from app.domain.entities import Booking
from app.domain.exceptions import (
    BookingNotFound,
    InvalidBooking,
    InvalidPhoneNumber,
    InvalidName,
    InvalidDate,
    InvalidPrice,
    BookingAlreadyCanceled
)

class BookingService:
    """Create, get and cancel Booking """
    def __init__(self, booking_repo):
        self.booking_repo = booking_repo

    def create_booking(self, data: dict) -> Booking:
        """Create booking"""
        name = data.get('name', '').strip()
        if not name or len(name) < 2:
            raise InvalidName(name, "Name must be at least characters")

        phone = data.get('phone', '').strip()
        if not self._is_valid_phone(phone):
            raise InvalidPhoneNumber

        price = data.get('price', 0)
        if price <= 0:
            raise InvalidPrice(price, "Price must be positive")

        travel_date = data.get('travel_date', '')
        if not travel_date:
            raise InvalidDate(travel_date, "Travel date is required")

        required_fields = ['bus_provider', 'from_district', 'to_disctrict', 'dropping_point']
        for field in required_fields:
            if not data.get(field):
                raise InvalidBooking(f"{field.replace('_', ' ').title()} is required", field)

        booking = Booking(**data)
        return self.booking_repo.save(booking)

    def get_bookings_by_phone(self, phone: str) -> List[Booking]:
        """Get bookings via phone number"""
        if not self._is_valid_phone(phone):
            raise InvalidPhoneNumber(phone)
        return self.booking_repo.find_by_phone(phone)

    def cancel_booking(self, booking_id: int) -> Booking:
        """Cancel a booking"""
        booking = self.booking_repo.find_by_id(booking_id)
        if not booking:
            raise BookingNotFound(f"Booking {booking_id} not found")
        if booking.status == "canceled":
            raise BookingAlreadyCanceled(booking_id)

        booking.cancel()
        return self.booking_repo.update(booking)

    def _is_valid_phone(self, phone: str) -> bool:
        """Validate phone number format"""
        phone = phone.replace(' ', '').replace('-', '')
        pattern = r'^(01[3-9]\d{8}|880\d{10}|\+880\d{10})$'
        return re.match(pattern, phone) is not None
