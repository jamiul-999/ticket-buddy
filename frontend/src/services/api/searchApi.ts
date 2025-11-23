import { apiClient } from './client';
import { SearchRequest, SearchResponse, District } from '../types/search';

export const searchApi = {
  searchBuses: async (request: SearchRequest): Promise<SearchResponse> => {
    const response = await apiClient.post('/search', request);
    return response.data;
  },

  getDistricts: async (): Promise<District[]> => {
    const response = await apiClient.get('/search/districts');
    return response.data;
  },

  getProviders: async (): Promise<string[]> => {
    const response = await apiClient.get('/search/providers');
    return response.data;
  },
};