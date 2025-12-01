'use client';

import { useState } from 'react';
import SearchForm from '../components/search/SearchForm';
import SearchResults from '../components/search/SearchResults';
import BookingForm from '../components/booking/BookingForm';
import BookingList from '../components/booking/BookingList';
import QueryInterface from '../components/rag/QueryInterface';
import { RouteResponse } from '../lib/types/search';

export default function Home() {
  const [searchResults, setSearchResults] = useState<RouteResponse[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'bookings' | 'query'>('search');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ticket Buddy
          </h1>
          <p className="text-lg text-gray-600">
            Your friend to book your bus tickets easily and securely
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'search'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Search & Book
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'bookings'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab('query')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'query'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Ask Questions
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'search' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <SearchForm onSearchResults={setSearchResults} />
              </div>
              
              <div className="lg:col-span-2 space-y-6">
                <SearchResults 
                  results={searchResults}
                  onSelectRoute={setSelectedRoute}
                />
                
                {selectedRoute && (
                  <BookingForm 
                    route={selectedRoute}
                    onBookingSuccess={() => {
                      setSelectedRoute(null);
                      setSearchResults([]);
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="max-w-4xl mx-auto">
              <BookingList />
            </div>
          )}

          {activeTab === 'query' && (
            <div className="max-w-4xl mx-auto">
              <QueryInterface />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}