'use client';

import { useState } from 'react';
import { useBookings } from '../../lib/hooks/useBookings';
import { RouteResponse } from '../../lib/types/search';
import { BookingCreate } from '../../lib/types/booking';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface BookingFormProps {
  route: RouteResponse;
  onBookingSuccess: () => void;
}

export default function BookingForm({ route, onBookingSuccess }: BookingFormProps) {
  const { createBooking, loading, error } = useBookings();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    travel_date: '',
    travel_time: '08:00'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingData: BookingCreate = {
      ...formData,
      bus_provider: route.provider,
      from_district: route.from_district,
      to_district: route.to_district,
      dropping_point: route.dropping_point,
      price: route.price
    };

    const success = await createBooking(bookingData);
    if (success) {
      onBookingSuccess();
      setFormData({ name: '', phone: '', travel_date: '', travel_time: '08:00' });
      alert('Booking created successfully!');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Book Your Ticket</h3>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900">Route Details</h4>
        <p className="text-blue-700">
          {route.provider} • {route.from_district} to {route.to_district}
        </p>
        <p className="text-blue-700">
          Price: ৳{route.price} • Dropping Point: {route.dropping_point}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter your full name"
              required
              minLength={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="01XXXXXXXXX"
              required
              minLength={11}
              maxLength={15}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Travel Date *
            </label>
            <Input
              type="date"
              value={formData.travel_date}
              onChange={(e) => handleChange('travel_date', e.target.value)}
              min={today}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Travel Time *
            </label>
            <select
              value={formData.travel_time}
              onChange={(e) => handleChange('travel_time', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              aria-label="Select travel time"
              aria-required="true"
            >
              <option value="06:00">6:00 AM</option>
              <option value="08:00">8:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="18:00">6:00 PM</option>
              <option value="20:00">8:00 PM</option>
              <option value="22:00">10:00 PM</option>
            </select>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-medium"
        >
          {loading ? 'Booking...' : `Confirm Booking - ৳${route.price}`}
        </Button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}