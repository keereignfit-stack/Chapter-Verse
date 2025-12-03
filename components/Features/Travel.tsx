import React, { useState } from 'react';
import { findTravelDestinations } from '../../services/geminiService';
import { AIResponse } from '../../types';

const Travel: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    const response = await findTravelDestinations(query);
    setResult(response);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif font-bold text-gray-900">Romantic Getaways</h2>
        <p className="mt-2 text-lg text-gray-600">
          Discover trending destinations using live Google Search data.
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-lg mx-auto mb-10">
        <div className="flex shadow-sm rounded-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Affordable beach honeymoon in Europe..."
            className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm border"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Explore'}
          </button>
        </div>
      </form>

      {result && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Destinations</h3>
            <div className="prose prose-blue max-w-none text-gray-700 mb-6 whitespace-pre-line">
              {result.text}
            </div>

            {/* Render Search Grounding Sources */}
            {result.groundingChunks && result.groundingChunks.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Sources</h4>
                    <div className="grid gap-2">
                        {result.groundingChunks.map((chunk, i) => {
                            if (chunk.web) {
                                return (
                                    <a 
                                        key={i} 
                                        href={chunk.web.uri}
                                        target="_blank"
                                        rel="noopener noreferrer" 
                                        className="flex items-center text-sm text-blue-600 hover:underline"
                                    >
                                        <span className="truncate">{chunk.web.title}</span>
                                        <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                    </a>
                                )
                            }
                            return null;
                        })}
                    </div>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Travel;