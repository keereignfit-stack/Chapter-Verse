import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { planWedding, generateSpeech, playAudioBuffer } from '../../services/geminiService';

const WeddingPlan: React.FC = () => {
  const [details, setDetails] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  const handlePlan = async () => {
    if (!details) return;
    setLoading(true);
    const result = await planWedding(details);
    setPlan(result);
    setLoading(false);
  };

  const handleReadAloud = async () => {
    if (!plan) return;
    setAudioLoading(true);
    const buffer = await generateSpeech(plan.substring(0, 500)); // Read first 500 chars to avoid limits
    if (buffer) {
        playAudioBuffer(buffer);
    }
    setAudioLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif font-bold text-gray-900">Dream Wedding Architect</h2>
        <p className="mt-2 text-lg text-gray-600">
          Powered by Gemini 2.5 Pro "Thinking Mode" for deep, complex planning.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Describe your dream wedding (Guest count, budget, vibe, location, season)
        </label>
        <textarea
          rows={4}
          className="shadow-sm focus:ring-rose-500 focus:border-rose-500 block w-full sm:text-sm border-gray-300 rounded-md border p-3"
          placeholder="e.g., Rustic barn wedding in October for 150 guests, budget $30k, warm color palette..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handlePlan}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
          >
            {loading ? (
                <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Thinking deeply...
                </span>
            ) : 'Generate Plan'}
          </button>
        </div>
      </div>

      {plan && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif font-bold text-gray-900">Your Wedding Blueprint</h3>
                <button 
                    onClick={handleReadAloud}
                    disabled={audioLoading}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                   {audioLoading ? 'Loading Audio...' : 'Read Aloud 🔊'}
                </button>
            </div>
            <div className="prose prose-rose max-w-none text-gray-700">
              <ReactMarkdown>{plan}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeddingPlan;