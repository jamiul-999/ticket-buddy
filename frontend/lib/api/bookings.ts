import { apiClient } from "./client";
import { BookingCreate, BookingResponse, BookingCancelRequest } from '../types/booking';

export const bookingApi = {
    createBooking: (booking: BookingCreate): Promise<BookingResponse> =>
        apiClient.post<BookingResponse>('/bookings', booking),

    cancelBooking: (request: BookingCancelRequest): Promise<any> =>
        apiClient.post('/bookings/cancel-by-details', request),

    getBookingsByPhone: (phone: string): Promise<BookingResponse[]> =>
        apiClient.get<BookingResponse[]>(`/bookings/by-phone?phone=${encodeURIComponent(phone)}`),
};