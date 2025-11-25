import { apiClient } from './client';
import { QueryRequest, QueryResponse } from '../types/query';

export const ragApi = {
  query: async (request: QueryRequest): Promise<QueryResponse> => {
    const response = await apiClient.post<QueryResponse>('/api/query', request);
    return response.data;
  },
};