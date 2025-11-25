import React from 'react';
import { Layout } from '../components/layout/Layout';
import { BookingList } from '../components/booking/BookingList';
import { useBookings } from '../hooks/useBookings';
import { CancelBookingRequest } from '../services/types/booking';

export const BookingsPage: React.FC = () => {
  const { loading, bookings, fetchBookingsByPhone, cancelBooking } = useBookings();

  const handleCancel = async (booking: CancelBookingRequest) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    await cancelBooking({
      phone: booking.phone,
      travel_date: booking.travel_date,
      travel_time: booking.travel_time,
      bus_provider: booking.bus_provider,
      from_district: booking.from_district,
      to_district: booking.to_district,
      dropping_point: booking.dropping_point,
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage your bus ticket bookings</p>
        </div>

        <BookingList
          bookings={bookings}
          loading={loading}
          onSearch={fetchBookingsByPhone}
          onCancel={handleCancel}
        />
      </div>
    </Layout>
  );
};
