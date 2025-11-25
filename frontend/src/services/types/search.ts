export interface SearchRequest {
  from_district: string;
  to_district: string;
  max_price?: number;
}

export interface RouteResponse {
  provider: string;
  from_district: string;
  to_district: string;
  dropping_point: string;
  price: number;
}

