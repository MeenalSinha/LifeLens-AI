import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">LifeLens AI</h1>
            <p className="text-xs text-indigo-600 font-medium">Turn confusion into clarity</p>
          </div>
        </div>
        <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
          Gemini 2.5 Flash
        </div>
      </div>
    </header>
  );
};

export default Header;