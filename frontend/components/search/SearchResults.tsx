'use client';

import { RouteResponse } from '../../lib/types/search';
import { Button } from '../ui/button';

interface SearchResultsProps {
  results: RouteResponse[];
  onSelectRoute: (route: RouteResponse) => void;
}

export default function SearchResults({ results, onSelectRoute }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No buses found</h3>
        <p className="text-gray-500">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">
          Available Buses ({results.length})
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {results.map((route, index) => (
          <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  {route.provider}
                </h4>
                <p className="text-gray-600 mt-1">
                  {route.from_district} → {route.to_district}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Dropping Point: {route.dropping_point}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  ৳{route.price}
                </p>
                <Button
                  onClick={() => onSelectRoute(route)}
                  className="mt-2 bg-blue-600 hover:bg-blue-700"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}