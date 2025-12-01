import { useState } from 'react';
import { searchApi } from '../api/search';
import { RouteResponse, SearchRequest } from '../types/search';

export const useSearch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<RouteResponse[]>([]);
    const [districts, setDistricts] = useState<string[]>([]);
    const [providers, setProviders] = useState<string[]>([]);

    const searchBuses = async (request: SearchRequest) => {
        setLoading(true);
        setError(null);
        try {
            const data = await searchApi.searchBuses(request);
            setResults(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed');
        } finally {
            setLoading(false);
        }
    };

    const loadDistricts = async () => {
        try {
            const data = await searchApi.getDistricts();
            setDistricts(data);
        } catch (err) {
            console.error('Failed to load districts:', err);
        }
    };

    const loadProviders = async () => {
        try {
            const data = await searchApi.getProviders();
            setProviders(data);
        } catch (err) {
            console.error('Failed to load providers:', err);
        }
    };

    return {
        loading,
        error,
        results,
        districts,
        providers,
        searchBuses,
        loadDistricts,
        loadProviders,
    };
};