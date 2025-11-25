import { apiClient } from './client';
import { BookingResponse, BookingCreate, CancelBookingRequest } from '../types/booking';

export const bookingApi = {
  create: async (request: BookingCreate): Promise<BookingResponse> => {
    const response = await apiClient.post<BookingResponse>('/api/bookings', request);
    return response.data;
  },
  
  cancel: async (request: CancelBookingRequest): Promise<void> => {
    await apiClient.post('/api/bookings/cancel-by-details', request);
  },

  getBookingsByPhone: async (phone: string): Promise<BookingResponse[]> => {
    const response = await apiClient.get(`/api/bookings?phone=${encodeURIComponent(phone)}`);
    return response.data;
  },

  // getBookingById: async (id: number): Promise<BookingResponse> => {
  //   const response = await apiClient.get(`/bookings/${id}`);
  //   return response.data;
  // },

  // cancelBooking: async (id: number): Promise<void> => {
  //   await apiClient.delete(`/bookings/${id}`);
  // },

};