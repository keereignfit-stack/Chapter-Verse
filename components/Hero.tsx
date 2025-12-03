import React, { useEffect, useState } from 'react';
import { AppSection } from '../types';
import { getQuickRomanticTip } from '../services/geminiService';

interface HeroProps {
  setSection: (section: AppSection) => void;
}

const Hero: React.FC<HeroProps> = ({ setSection }) => {
  const [tip, setTip] = useState<string>("Loading daily inspiration...");

  useEffect(() => {
    // Fast AI Response (Flash Lite)
    getQuickRomanticTip().then(setTip);
  }, []);

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl font-serif">
                <span className="block xl:inline">Every love story</span>{' '}
                <span className="block text-rose-600 xl:inline">deserves a beautiful setting</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Chapter&Verse helps you write the next page of your journey. From first dates to wedding vows and romantic getaways, we're here to guide you.
              </p>
              
              {/* Fast AI Tip Section */}
              <div className="mt-6 p-4 bg-rose-50 border-l-4 border-rose-400 rounded-r-md">
                <p className="text-xs font-bold text-rose-500 uppercase tracking-wide">Daily Inspiration (AI Powered)</p>
                <p className="mt-1 text-sm text-gray-700 italic font-serif">"{tip}"</p>
              </div>

              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <button
                    onClick={() => setSection(AppSection.DATES)}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 md:py-4 md:text-lg transition"
                  >
                    Find Date Spots
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button
                    onClick={() => setSection(AppSection.WEDDING)}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-rose-700 bg-rose-100 hover:bg-rose-200 md:py-4 md:text-lg transition"
                  >
                    Plan Wedding
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://picsum.photos/seed/love/800/600"
          alt="Couple holding hands"
        />
      </div>
    </div>
  );
};

export default Hero;