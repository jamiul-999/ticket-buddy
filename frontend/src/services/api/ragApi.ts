import { apiClient } from './client';
import { RagQueryRequest, RagQueryResponse } from '../types/rag';

export const ragApi = {
  query: async (request: RagQueryRequest): Promise<RagQueryResponse> => {
    const response = await apiClient.post('/query', request);
    return response.data;
  },
};