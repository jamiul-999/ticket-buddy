import { apiClient } from './client';
import { Booking, BookingCreateRequest, CancelBookingRequest } from '../types/booking';

export const bookingApi = {
  createBooking: async (request: BookingCreateRequest): Promise<Booking> => {
    const response = await apiClient.post('/bookings', request);
    return response.data;
  },

  getBookingsByPhone: async (phone: string): Promise<Booking[]> => {
    const response = await apiClient.get(`/bookings?phone=${encodeURIComponent(phone)}`);
    return response.data;
  },

  getBookingById: async (id: number): Promise<Booking> => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  cancelBooking: async (id: number): Promise<void> => {
    await apiClient.delete(`/bookings/${id}`);
  },

  cancelBookingByDetails: async (request: CancelBookingRequest): Promise<void> => {
    await apiClient.post('/bookings/cancel-by-details', request);
  },
};