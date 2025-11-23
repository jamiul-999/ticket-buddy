export interface BookingCreateRequest {
  name: string;
  phone: string;
  bus_provider: string;
  from_district: string;
  to_district: string;
  dropping_point: string;
  price: number;
  travel_date: string;
  travel_time: string;
}

export interface Booking {
  id: number;
  name: string;
  phone: string;
  bus_provider: string;
  from_district: string;
  to_district: string;
  dropping_point: string;
  price: number;
  travel_date: string;
  travel_time: string;
  booking_date: string;
  status: 'confirmed' | 'canceled';
}

export interface CancelBookingRequest {
  phone: string;
  travel_date: string;
  travel_time: string;
  bus_provider: string;
  from_district: string;
  to_district: string;
  dropping_point: string;
}