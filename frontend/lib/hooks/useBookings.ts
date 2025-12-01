import { useState } from 'react';
import { bookingApi } from '../api/bookings';
import { BookingCreate, BookingResponse, BookingCancelRequest } from '../types/booking';

export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);

  const createBooking = async (booking: BookingCreate): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const newBooking = await bookingApi.createBooking(booking);
      setBookings(prev => [...prev, newBooking]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking creation failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (request: BookingCancelRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await bookingApi.cancelBooking(request);
      setBookings(prev => prev.filter(booking => 
        !(booking.phone === request.phone &&
          booking.travel_date === request.travel_date &&
          booking.travel_time === request.travel_time &&
          booking.bus_provider === request.bus_provider)
      ));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking cancellation failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getBookingsByPhone = async (phone: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingApi.getBookingsByPhone(phone);
      setBookings(data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    bookings,
    createBooking,
    cancelBooking,
    getBookingsByPhone,
  };
};