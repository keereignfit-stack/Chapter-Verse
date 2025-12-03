import React, { useState, useEffect } from 'react';
import { findDateSpots } from '../../services/geminiService';
import { AIResponse, GeoLocation } from '../../types';

const DateNight: React.FC = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState<GeoLocation | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation blocked or failed", error);
        }
      );
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    const response = await findDateSpots(query, location);
    setResult(response);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif font-bold text-gray-900">Find the Perfect Date Spot</h2>
        <p className="mt-2 text-lg text-gray-600">
          Using Google Maps data to find real places near you.
          {!location && <span className="block text-sm text-rose-500 mt-1">(Enable location for local results)</span>}
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-lg mx-auto mb-10">
        <div className="flex shadow-sm rounded-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Cozy Italian dinner with a view..."
            className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-md border-gray-300 focus:ring-rose-500 focus:border-rose-500 sm:text-sm border"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-r-md text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {result && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
          <div className="p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recommendations</h3>
            <div className="prose prose-rose max-w-none text-gray-700 mb-6 whitespace-pre-line">
              {result.text}
            </div>
            
            {result.groundingChunks?.map((chunk, index) => {
              if (chunk.maps) {
                return (
                  <div key={index} className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-900">{chunk.maps.title}</h4>
                    {chunk.maps.placeAnswerSources?.[0]?.reviewSnippets?.[0] && (
                        <p className="text-sm text-gray-500 italic mt-1">
                            "{chunk.maps.placeAnswerSources[0].reviewSnippets[0].content}"
                        </p>
                    )}
                    <a 
                      href={chunk.maps.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-sm font-medium text-rose-600 hover:text-rose-500"
                    >
                      View on Google Maps &rarr;
                    </a>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateNight;