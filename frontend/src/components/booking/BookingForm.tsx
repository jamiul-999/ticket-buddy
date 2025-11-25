import React, { useState } from 'react';
import { BookingCreate } from '../../services/types/booking';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface BookingFormProps {
  initialData?: {
    provider: string;
    from: string;
    to: string;
    droppingPoint: string;
    travel_date: string;
    travel_time: string;
    price: number;
  };
  onSubmit: (booking: BookingCreate) => Promise<boolean>;
  onCancel?: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    travel_date: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Invalid Bangladesh phone number (01XXXXXXXXX)';
    }

    if (!formData.travel_date) {
      newErrors.travel_date = 'Travel date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !initialData) return;

    setLoading(true);
    const success = await onSubmit({
      name: formData.name,
      phone: formData.phone.replace(/[\s-]/g, ''),
      bus_provider: initialData.provider,
      from_district: initialData.from,
      to_district: initialData.to,
      dropping_point: initialData.droppingPoint,
      price: initialData.price,
      travel_date: formData.travel_date,
      travel_time: initialData.travel_time,
    });

    setLoading(false);

    if (success) {
      setFormData({ name: '', phone: '', travel_date: '' });
      onCancel?.();
    }
  };

  if (!initialData) return null;

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Complete Your Booking</h2>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-2">Journey Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Provider:</span>
            <span className="ml-2 font-medium">{initialData.provider}</span>
          </div>
          <div>
            <span className="text-gray-600">Route:</span>
            <span className="ml-2 font-medium">
              {initialData.from} → {initialData.to}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Dropping Point:</span>
            <span className="ml-2 font-medium">{initialData.droppingPoint}</span>
          </div>
          <div>
            <span className="text-gray-600">Fare:</span>
            <span className="ml-2 font-medium text-primary">৳{initialData.price}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          placeholder="Enter your full name"
        />

        <Input
          label="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          error={errors.phone}
          placeholder="01XXXXXXXXX"
        />

        <Input
          label="Travel Date"
          type="date"
          value={formData.travel_date}
          onChange={(e) => setFormData({ ...formData, travel_date: e.target.value })}
          error={errors.travel_date}
          min={new Date().toISOString().split('T')[0]}
        />

        

        <div className="flex gap-4">
          <Button type="submit" loading={loading} className="flex-1">
            Confirm Booking
          </Button>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}