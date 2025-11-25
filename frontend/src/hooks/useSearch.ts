import { useState, useCallback } from 'react';
import { searchApi } from '../services/api/searchApi';
import { SearchRequest, RouteResponse } from '../services/types/search';
import toast from 'react-hot-toast';

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RouteResponse[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  const searchBuses = async (params: SearchRequest) => {
    setLoading(true);
    setResults([]);
    
    try {
      const data = await searchApi.searchBuses(params);
      setResults(data);

      if (data.length === 0) {
        toast.error('No bus found for your criteria');
      } else {
        toast.success(`Found ${data.length} available route${data.length > 1 ? 's' : ''}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = useCallback(async () => {
    try {
      const data = await searchApi.getDistricts();
      setDistricts(data);
    } catch (error) {
      toast.error('Failed to load districts');
      setDistricts([]);
    }
  }, []);

  const clearResults = () => setResults([]);

  return {
    loading,
    results,
    districts,
    searchBuses,
    fetchDistricts,
    clearResults,
  };
};