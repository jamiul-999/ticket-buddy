import React, { useState } from 'react';
import { BookingResponse } from '../../services/types/booking';
import { BookingCard } from './BookingCard';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Search, AlertCircle } from 'lucide-react';

interface BookingListProps {
  bookings: BookingResponse[];
  loading: boolean;
  onSearch: (phone: string) => void;
  onCancel: (booking: BookingResponse) => void;
}

export const BookingList: React.FC<BookingListProps> = ({
  bookings,
  loading,
  onSearch,
  onCancel,
}) => {
const [phone, setPhone] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      onSearch(phone.replace(/[\s-]/g, ''));
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number (01XXXXXXXXX)"
          className="flex-1"
        />
        <Button type="submit" loading={loading} className="flex items-center gap-2">
          <Search size={20} />
          Search
        </Button>
      </form>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {!loading && bookings.length === 0 && phone && (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">No bookings found for this phone number</p>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onCancel={onCancel} />
          ))}
        </div>
      )}
    </div>
  );
};