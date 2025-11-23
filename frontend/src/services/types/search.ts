export interface SearchRequest {
  from_district: string;
  to_district: string;
  max_price?: number;
}

export interface BusRoute {
  id: number;
  provider: string;
  from_district: string;
  to_district: string;
  dropping_point: string;
  price: number;
  travel_time?: string;
}

export interface SearchResponse {
  routes: BusRoute[];
  total: number;
}