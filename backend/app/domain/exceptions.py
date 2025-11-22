"""Exception handling for domain-specific exceptions"""

from datetime import date

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
    #pass

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

class BookingAlreadyCanceled(BookingException):
    "Exception for the already booked tickets"

    def __init__(self, booking_id: int):
        super().__init__(
            message=f"Booking {booking_id} is already canceled.",
            details={"booking_id": booking_id, "status": "canceled"}
        )

class DuplicateBooking(BookingException):
    """Raised when there is a duplicate booking"""

    def __init__(self, phone: str, travel_date: date, travel_time: str,
                 bus_provider: str):
        super().__init__(
            message="Duplicated booking detected for the same coach",
            details={
                "phone": phone,
                "travel_date": travel_date,
                "travel_time": travel_time,
                "bus_provider": bus_provider
            }
        )

# Search exceptions
class SearchException(DomainException):
    """Base exception for search-related errors"""


class RouteNotFound(SearchException):
    """Raised when no routes are found for the search criteria"""

    def __init__(self, from_district: str, to_district: str):
        super().__init__(
            message=f"No routes found from {from_district} to {to_district}",
            details={
                "from_district": from_district,
                "to_district": to_district
            }
        )

# Validation exceptions
class ValidationException(DomainException):
    """Base exception for validation errors"""

class InvalidPhoneNumber(ValidationException):
    """Raised when phone number is invalid"""

    def __init__(self, phone: str):
        super().__init__(
            message=f"Invalid phone number: {phone}",
            details={"phone": phone}
        )

class InvalidName(ValidationException):
    """Raised when name is invalid"""

    def __init__(self, name: str, reason: str = "Name too short"):
        super().__init__(
            message=f"Invalid name: {reason}",
            details={"name": name}
        )

class InvalidDate(ValidationException):
    """Raised when date is invalid"""

    def __init__(self, travel_date: date, reason: str = None):
        message = f"Invalid date: {travel_date}"
        if reason:
            message += f" - {reason}"
        super().__init__(
            message=message,
            details={"date": travel_date}
        )

class InvalidPrice(ValidationException):
    """Raised when input price is invalid"""

    def __init__(self, price: float, reason: str = None):
        message = f"Invalid price: {price}"
        if reason:
            message += f" - {reason}"
        super().__init__(
            message=message,
            details={"price": price}
        )

class ProviderException(DomainException):
    """Base exception for provider-related errors"""


class ProviderNotFound(ProviderException):
    """Raised when a provider is not found"""

    def __init__(self, provider_name: str):
        super().__init__(
            message=f"Provider '{provider_name}' not found",
            details={"provider_name": provider_name}
        )

class ProviderInformationNotAvailable(ProviderException):
    """Raised when provider information cannot be retrieved"""

    def __init__(self, provider_name: str):
        super().__init__(
            message=f"Information not available for provider '{provider_name}'",
            details={"provider_name": provider_name}
        )

class RAGQueryFailed(ProviderException):
    """Raised when RAG query fails"""

    def __init__(self, query: str, reason: str = None):
        details = {"query": query}
        if reason:
            details["reason"] = reason
        super().__init__(
            message="RAG query failed",
            details=details
        )
