export interface QueryRequest {
  query: string;
}

export interface QueryResponse {
  answer: string;
  query_type: string;
  results?: RouteResult[];
  providers?: string[];
  routes?: RouteInfo[];
  contact_info?: ContactInfo;
  from?: string;
  to?: string;
}

export interface RouteResult {
  provider: string;
  price: number;
  dropping_point?: string;
}

export interface RouteInfo {
  provider: string;
  price: number;
  dropping_point?: string;
}

export interface ContactInfo {
  provider: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string
}