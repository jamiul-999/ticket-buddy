"""Booking route"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.schemas.booking import BookingResponse, BookingCreate
from app.infra.database.connection import get_db
from app.infra.repos.booking_repo import BookingRepository
from app.domain.services.booking_service import BookingService
from app.domain.exceptions import (
    InvalidBooking,
    BookingNotFound,
    InvalidPhoneNumber,
    InvalidName,
    InvalidDate,
    InvalidPrice,
    BookingAlreadyCanceled,
    BookingException,
    DuplicateBooking
)

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("", response_model=BookingResponse, status_code=201)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    """Create a booking"""
    try:
        repo = BookingRepository(db)
        service = BookingService(repo)
        result = service.create_booking(booking.dict())
        return result
    except DuplicateBooking as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "error": "Duplicate Booking",
                "message": str(e),
                "details": e.details
            }
        ) from e
    except (InvalidBooking, InvalidPhoneNumber, InvalidName, InvalidDate, InvalidPrice) as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "Validation error",
                "message": str(e),
                "details": e.details if hasattr(e, 'details') else {}
            }
        ) from e
    except BookingException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "Booking Error", "message": str(e)}
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Internal Server Error", "message": "An unexpected error has occurred"}
        ) from e

@router.get("", response_model=List[BookingResponse])
def get_bookings(phone: str, db: Session = Depends(get_db)):
    """Get all bookings by phone number"""
    try:
        repo = BookingRepository(db)
        service = BookingService(repo)
        return service.get_bookings_by_phone(phone)
    except InvalidPhoneNumber as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "Invalid phone number",
                "message": str(e),
                "details": e.details
            }
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Internal Server Error"}
        ) from e

@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    """Get a specific booking by ID"""
    try:
        repo = BookingRepository(db)
        service = BookingService(repo)
        return service.get_booking_by_id(booking_id)
    except BookingNotFound as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": "Not Found",
                "message": str(e),
                "details": e.details
            }
        ) from e

@router.delete("/{booking_id}")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    """Cancel a booking"""
    try:
        repo = BookingRepository(db)
        service = BookingService(repo)
        service.cancel_booking(booking_id)
        return {
            "message": "Booking cancelled successfully",
            "booking_id": booking_id
            }
    except BookingNotFound as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": "Not found",
                "message": str(e),
                "details": e.details
            }
        ) from e
    except BookingAlreadyCanceled as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "Already canceled",
                "message": str(e),
                "details": e.details
            }
        ) from e
