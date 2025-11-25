import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { QueryInput } from '../components/query/QueryInput';
import { QueryResult } from '../components/query/QueryResults';
import { BookingForm } from '../components/booking/BookingForm';
import { useQuery } from '../hooks/useQuery';
import { useBookings } from '../hooks/useBookings';
import { Card } from '../components/common/Card';
import { RouteResult } from '../services/types/query';
import { Bus, MessageCircle, Calendar } from 'lucide-react';

export const Home: React.FC = () => {
  const { loading, result, executeQuery } = useQuery();
  const { createBooking } = useBookings();
  const [bookingData, setBookingData] = useState<{
    provider: string;
    from: string;
    to: string;
    droppingPoint: string;
    price: number;
  } | null>(null);

  const handleBook = (route: RouteResult, from: string, to: string) => {
    setBookingData({
      provider: route.provider,
      from,
      to,
      droppingPoint: route.dropping_point,
      price: route.price,
    });
  };

  const handleBookingSubmit = async (booking: any) => {
    const success = await createBooking(booking);
    if (success) {
      setBookingData(null);
    }
    return success;
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-800">
            Welcome to <span className="text-primary">TicketBuddy</span>
          </h1>
          <p className="text-xl text-gray-600">
            Your AI-powered bus booking assistant for Bangladesh
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <MessageCircle className="mx-auto text-primary mb-3" size={40} />
            <h3 className="font-bold text-lg mb-2">Ask Anything</h3>
            <p className="text-gray-600 text-sm">
              Get instant answers about routes, prices, and bus providers
            </p>
          </Card>
          <Card className="text-center">
            <Bus className="mx-auto text-primary mb-3" size={40} />
            <h3 className="font-bold text-lg mb-2">Compare Options</h3>
            <p className="text-gray-600 text-sm">
              Find the best buses that match your budget and preferences
            </p>
          </Card>
          <Card className="text-center">
            <Calendar className="mx-auto text-primary mb-3" size={40} />
            <h3 className="font-bold text-lg mb-2">Book Instantly</h3>
            <p className="text-gray-600 text-sm">
              Secure your seat with just a few clicks
            </p>
          </Card>
        </div>

        {/* Query Interface */}
        <Card>
          <h2 className="text-2xl font-bold mb-4">Ask About Bus Services</h2>
          <QueryInput onSubmit={executeQuery} loading={loading} />
        </Card>

        {/* Results */}
        {result && (
          <QueryResult result={result} onBook={handleBook} />
        )}

        {/* Booking Form */}
        {bookingData && (
          <BookingForm
            initialData={bookingData}
            onSubmit={handleBookingSubmit}
            onCancel={() => setBookingData(null)}
          />
        )}
      </div>
    </Layout>
  );
};