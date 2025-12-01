import { apiClient } from './client';
import { SearchRequest, RouteResponse } from '../types/search';

export const searchApi = {
    searchBuses: (request: SearchRequest): Promise<RouteResponse[]> =>
        apiClient.post<RouteResponse[]>('/search', request),

    getDistricts: (): Promise<string[]> =>
        apiClient.get<string[]>('/search/districts'),

    getProviders: (): Promise<string[]> =>
        apiClient.get<string[]>('search/providers'),
}
