import { useState, useCallback } from 'react';
import { BookingResponse, BookingCreate, CancelBookingRequest } from '../services/types/booking';
import { bookingApi } from '../services/api/bookingApi';
import toast from 'react-hot-toast';

export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);

  const createBooking = async (booking: BookingCreate): Promise<boolean> => {
    setLoading(true);
    try {
      await bookingApi.create(booking);
      toast.success('Booking created successfully!');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Booking failed!');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingsByPhone = useCallback(async (phone: string) => {
    if (!phone) return;
    setLoading(true);

    try {
      const data = await bookingApi.getBookingsByPhone(phone);
      setBookings(data);
      return data;
    } catch (error) {
      toast.error('Failed to loead bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelBooking = async (request: CancelBookingRequest): Promise<boolean> => {
    setLoading(true);
    try {
      await bookingApi.cancel(request);
      toast.success('Booking canceled successfully');
      await fetchBookingsByPhone(request.phone);
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Cancelation failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    bookings,
    createBooking,
    fetchBookingsByPhone,
    cancelBooking,
  };
};