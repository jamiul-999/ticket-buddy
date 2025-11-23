export interface RagQueryRequest {
  query: string;
}

export interface RagQueryResponse {
  answer: string;
  query_type: string;
  results?: any[];
  providers?: string[];
  contact_info?: {
    provider: string;
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
  };
}