'use client';

import { useState } from 'react';
import { ragApi } from '../../lib/api/rag';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface QueryResult {
  answer: any;
  provider?: string;
  confidence?: number;
  sources?: any[];
}

export default function QueryInterface() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<QueryResult[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await ragApi.query(query);
      setResults(prev => [result, ...prev]);
      setQuery('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query failed');
    } finally {
      setLoading(false);
    }
  };

  const exampleQueries = [
    "Are there any buses from Dhaka to Rajshahi under 500 taka?",
    "Show all bus providers operating from Chittagong to Sylhet",
    "What are the contact details of Hanif Bus?",
    "Can I cancel my booking for the bus from Dhaka to Barishal on 15th November?",
    "What is the privacy policy of Shohagh Paribahan?",
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Ask Questions</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Question
            </label>
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about buses, providers, policies, etc."
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {loading ? 'Searching...' : 'Ask Question'}
          </Button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Example Queries */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Example Questions:</h3>
          <div className="space-y-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => setQuery(example)}
                className="block w-full text-left p-3 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Answers</h3>
          {results.map((result, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              {result.provider && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-blue-600">
                    {result.provider}
                  </span>
                  {result.confidence && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Confidence: {(result.confidence * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              )}
              
              <div className="prose prose-sm max-w-none">
                {typeof result.answer === 'string' ? (
                  <p className="text-gray-700">{result.answer}</p>
                ) : (
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(result.answer, null, 2)}
                  </pre>
                )}
              </div>

              {result.sources && result.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Sources:</h4>
                  <div className="space-y-1">
                    {result.sources.map((source, sourceIndex) => (
                      <div key={sourceIndex} className="text-xs text-gray-500">
                        {typeof source === 'string' ? source : JSON.stringify(source)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}