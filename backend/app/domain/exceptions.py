"""Exception handling for domain-specific exceptions"""

class DomainException(Exception):
    """Base exception for all domain related errors"""

    def __init__(self, message: str, details: dict = None):
        self.message = message
        self.details = details or {}
        super().__init__(self.message)

    def __str__(self):
        if self.details:
            return f"{self.message} | Details: {self.details}"
        return self.message

class BookingException(DomainException):
    """Base exception for booking-related errors"""
    pass

class BookingNotFound(BookingException):
    """Exception for a booking cannot be found"""

    def __init__(self, booking_id: int):
        super().__init__(
            message=f"Booking with ID {booking_id} not found",
            details={"booking_id": booking_id}
        )

class InvalidBooking(BookingException):
    """Exception for a booking data being invalid"""

    def __init__(self, message: str, field: str = None):
        details = {"field": field} if field else {}
        super().__init__(message=message, details=details)


# class RouteNotFound(Exception):
#     """No routes found"""
#     pass

# class ProviderNotFound(Exception):
#     """Provider not found"""
#     pass

# class DistrictNotFound(Exception):
#     """District not found"""
#     pass

# class PhoneNumberValidationError(Exception):
#     """Invalid phone number format"""
#     pass
