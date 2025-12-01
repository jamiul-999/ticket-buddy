'use client';

import { useState, useEffect } from 'react';
import { useSearch } from '../../lib/hooks/useSearch';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface SearchFormProps {
  onSearchResults: (results: any[]) => void;
}

export default function SearchForm({ onSearchResults }: SearchFormProps) {
  const { districts, providers, loadDistricts, searchBuses, loading, error } = useSearch();
  const [formData, setFormData] = useState({
    from_district: '',
    to_district: '',
    max_price: ''
  });

  useEffect(() => {
    loadDistricts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const results = (await searchBuses({
      ...formData,
      max_price: formData.max_price ? Number(formData.max_price) : undefined
    })) as any[] | undefined;
    onSearchResults(results ?? []);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Search Buses</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From District
            </label>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <select
              value={formData.from_district}
              onChange={(e) => handleChange('from_district', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              aria-label="Select departure district"
              aria-required="true"
            >
              <option value="">Select district</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To District
            </label>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <select
              value={formData.to_district}
              onChange={(e) => handleChange('to_district', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              aria-label="Select destination district"
              aria-required="true"
            >
              <option value="">Select district</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Price (Optional)
          </label>
          <Input
            type="number"
            value={formData.max_price}
            onChange={(e) => handleChange('max_price', e.target.value)}
            placeholder="e.g., 500"
            min="0"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          {loading ? 'Searching...' : 'Search Buses'}
        </Button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}