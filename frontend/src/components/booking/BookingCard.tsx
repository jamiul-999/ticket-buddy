import React from 'react';
import { BookingResponse } from '../../services/types/booking';
import { Card } from '../common/Card';
import { Button } from '../ui/Button';
import { Bus, MapPin, Calendar, Phone, DollarSign, CheckCircle, XCircle} from 'lucide-react';
import { format } from 'date-fns';

interface BookingCardProps {
  booking: BookingResponse;
  onCancel?: (booking: BookingResponse) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
  const isActive = booking.status === 'confirmed';
  const isPast = new Date(booking.travel_date) < new Date();

  return (
    <Card className={`${!isActive ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Bus className="text-primary" size={28} />
          <div>
            <h3 className="text-xl font-bold">{booking.bus_provider}</h3>
            <p className="text-sm text-gray-600">Booking ID: #{booking.id}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
          isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {booking.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-start gap-2">
          <MapPin className="text-gray-400 mt-1" size={18} />
          <div>
            <p className="text-xs text-gray-600">Route</p>
            <p className="font-medium">{booking.from_district} → {booking.to_district}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="text-gray-400 mt-1" size={18} />
          <div>
            <p className="text-xs text-gray-600">Dropping Point</p>
            <p className="font-medium">{booking.dropping_point}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="text-gray-400 mt-1" size={18} />
          <div>
            <p className="text-xs text-gray-600">Travel Date</p>
            <p className="font-medium">{format(new Date(booking.travel_date), 'dd MMM yyyy')}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <DollarSign className="text-gray-400 mt-1" size={18} />
          <div>
            <p className="text-xs text-gray-600">Fare</p>
            <p className="font-medium text-primary">৳{booking.price}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Phone className="text-gray-400 mt-1" size={18} />
          <div>
            <p className="text-xs text-gray-600">Contact</p>
            <p className="font-medium">{booking.phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="text-gray-400 mt-1" size={18} />
          <div>
            <p className="text-xs text-gray-600">Booked On</p>
            <p className="font-medium">{format(new Date(booking.booking_date), 'dd MMM yyyy')}</p>
          </div>
        </div>
      </div>

      {isActive && !isPast && onCancel && (
        <Button
          variant="danger"
          onClick={() => onCancel(booking)}
          className="w-full mt-4"
        >
          Cancel Booking
        </Button>
      )}
    </Card>
  );
};