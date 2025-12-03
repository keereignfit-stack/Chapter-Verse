import React from 'react';
import { AppSection } from '../types';

interface NavbarProps {
  currentSection: AppSection;
  setSection: (section: AppSection) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentSection, setSection }) => {
  const navItems = [
    { id: AppSection.HOME, label: 'Home' },
    { id: AppSection.DATES, label: 'Date Night' },
    { id: AppSection.WEDDING, label: 'Wedding' },
    { id: AppSection.TRAVEL, label: 'Travel' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setSection(AppSection.HOME)}>
            <span className="text-2xl font-serif font-bold text-rose-600 tracking-tight">Chapter<span className="text-rose-400">&</span>Verse</span>
          </div>
          <div className="hidden sm:flex sm:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`${
                  currentSection === item.id
                    ? 'border-rose-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
              >
                {item.label}
              </button>
            ))}
          </div>
          {/* Mobile menu button could go here, omitting for brevity in this specific task */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;