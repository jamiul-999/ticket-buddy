'use client';

import { useState, useEffect } from 'react';
import { useBookings } from '../../lib/hooks/useBookings';
import { BookingResponse } from '../../lib/types/booking';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export default function BookingList() {
  const { bookings, getBookingsByPhone, cancelBooking, loading, error } = useBookings();
  const [phone, setPhone] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      await getBookingsByPhone(phone);
    }
  };

  const handleCancelBooking = async (booking: BookingResponse) => {
    const success = await cancelBooking({
      phone: booking.phone,
      travel_date: booking.travel_date,
      travel_time: booking.travel_time,
      bus_provider: booking.bus_provider,
      from_district: booking.from_district,
      to_district: booking.to_district,
      dropping_point: booking.dropping_point
    });

    if (success) {
      setShowCancelConfirm(null);
      alert('Booking cancelled successfully!');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">My Bookings</h2>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Phone Number to View Bookings
            </label>
            <div className="flex gap-4">
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="flex-1"
                required
                minLength={11}
                maxLength={15}
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Loading...' : 'Search'}
              </Button>
            </div>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>

      {bookings.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              Your Bookings ({bookings.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h4 className="text-lg font-medium text-gray-900">
                        {booking.bus_provider}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Route:</strong> {booking.from_district} → {booking.to_district}
                      </div>
                      <div>
                        <strong>Dropping Point:</strong> {booking.dropping_point}
                      </div>
                      <div>
                        <strong>Travel Date:</strong> {formatDate(booking.travel_date)}
                      </div>
                      <div>
                        <strong>Travel Time:</strong> {booking.travel_time}
                      </div>
                      <div>
                        <strong>Price:</strong> ৳{booking.price}
                      </div>
                      <div>
                        <strong>Booked On:</strong> {formatDate(booking.booking_date)}
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm">
                      <strong>Passenger:</strong> {booking.name} • {booking.phone}
                    </div>
                  </div>
                  
                  {booking.status === 'confirmed' && (
                    <div className="ml-4">
                      <Button
                        variant="destructive"
                        onClick={() => setShowCancelConfirm(booking.id.toString())}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                {/* Cancel Confirmation Dialog */}
                {showCancelConfirm === booking.id.toString() && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 mb-3">
                      Are you sure you want to cancel this booking?
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        onClick={() => handleCancelBooking(booking)}
                        disabled={loading}
                      >
                        Yes, Cancel
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCancelConfirm(null)}
                      >
                        Keep Booking
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {bookings.length === 0 && phone && !loading && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500">No bookings found for phone number: {phone}</p>
        </div>
      )}
    </div>
  );
}