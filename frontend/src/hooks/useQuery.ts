import { useState } from 'react';
import { QueryResponse } from '../services/types/query';
import { ragApi } from '../services/api/ragApi';
import toast from 'react-hot-toast';

export const useQuery = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResponse | null>(null);

  const executeQuery = async (query: string) => {
    if (!query.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await ragApi.query({ query });
      setResult(response);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Query failed');
    } finally {
      setLoading(false);
    }
  };
   
  const clearResult = () => setResult(null);
  return {
    loading,
    result,
    executeQuery,
    clearResult
  };
};