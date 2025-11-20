"""Booking route"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.booking import BookingResponse, BookingCreate
from app.infra.database.connection import get_db
from app.infra.repos.booking_repo import BookingRepository
from app.domain.services.booking_service import BookingService
from app.domain.exceptions import InvalidBooking, BookingNotFound

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("", response_model=BookingResponse, status_code=201)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    """Create a booking"""
    try:
        repo = BookingRepository(db)
        service = BookingService(repo)
        result = service.create_booking(booking.dict())
        return result
    except InvalidBooking as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

@router.get("", response_model=List[BookingResponse])
def get_bookings(phone: str, db: Session = Depends(get_db)):
    """Get all bookings"""
    repo = BookingRepository(db)
    service = BookingService(repo)
    return service.get_bookings_by_phone(phone)

@router.delete("/{booking_id}")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    """Cancel a booking"""
    try:
        repo = BookingRepository(db)
        service = BookingService(repo)
        service.cancel_booking(booking_id)
        return {"message": "Booking cancelled"}
    except BookingNotFound as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
