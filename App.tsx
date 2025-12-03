import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DateNight from './components/Features/DateNight';
import WeddingPlan from './components/Features/WeddingPlan';
import Travel from './components/Features/Travel';
import ChatWidget from './components/Chat/ChatWidget';
import { AppSection } from './types';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<AppSection>(AppSection.HOME);

  const renderContent = () => {
    switch (currentSection) {
      case AppSection.HOME:
        return <Hero setSection={setCurrentSection} />;
      case AppSection.DATES:
        return <DateNight />;
      case AppSection.WEDDING:
        return <WeddingPlan />;
      case AppSection.TRAVEL:
        return <Travel />;
      default:
        return <Hero setSection={setCurrentSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col font-sans text-slate-800">
      <Navbar currentSection={currentSection} setSection={setCurrentSection} />
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-rose-100 mt-12">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8 flex flex-col items-center">
          <p className="text-center text-base text-gray-400">
            &copy; 2025 Chapter&Verse. Powered by Gemini.
          </p>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
};

export default App;