import { apiClient } from './client';
import { RouteResponse, SearchRequest } from '../types/search';

export const searchApi = {
  searchBuses: async (params: SearchRequest): Promise<RouteResponse[]> => {
    const response = await apiClient.post<RouteResponse[]>('/api/search', params);
    return response.data;
  },

  getDistricts: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/api//search/districts');
    return response.data;
  },

  getProviders: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/api/search/providers');
    return response.data;
  },
};