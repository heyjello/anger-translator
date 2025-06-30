/**
 * NavigationHeader Component
 * 
 * Updated header for voice editor theme with sleek design and local Bolt logo.
 */

import React from 'react';
import { History, BarChart3, Mic } from 'lucide-react';

interface NavigationHeaderProps {
  historyCount: number;
  showHistory: boolean;
  showStats: boolean;
  onToggleHistory: () => void;
  onToggleStats: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  historyCount,
  showHistory,
  showStats,
  onToggleHistory,
  onToggleStats
}) => {
  return (
    <header className="text-center mb-8 animate-fade-in relative">
      {/* Bolt Logo - Top Right */}
      <div className="absolute top-0 right-0 z-20">
        <a 
          href="https://bolt.new" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-12 h-12 hover:scale-110 transition-transform duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          title="Built with Bolt"
        >
          <img 
            src="/assets/logos/bolt-logo-black-circle.png" 
            alt="Built with Bolt" 
            className="w-full h-full object-contain filter drop-shadow-lg hover:drop-shadow-xl transition-all duration-300"
          />
        </a>
      </div>

      <div className="flex items-center justify-center gap-3 mb-4">
        <Mic size={40} className="text-blue-400 animate-pulse" />
        <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl">
          Anger Translator
        </h1>
      </div>
      
      <p className="text-lg md:text-xl text-slate-300 font-medium mb-6">
        Professional voice editor for your rage
      </p>
      
      <div className="flex justify-center">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-full px-6 py-2 border border-slate-700/50">
          <span className="text-slate-300 text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            AI-Powered Translation Engine
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={onToggleHistory}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 backdrop-blur-xl ${
            showHistory 
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
              : 'bg-slate-800/50 text-slate-300 hover:text-blue-400 hover:border-blue-500/30 border border-slate-700/50'
          }`}
          aria-pressed={showHistory}
          aria-label={`${showHistory ? 'Hide' : 'Show'} translation history`}
        >
          <History size={18} />
          History ({historyCount})
        </button>
        <button
          onClick={onToggleStats}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 backdrop-blur-xl ${
            showStats 
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50 shadow-[0_0_20px_rgba(147,51,234,0.3)]' 
              : 'bg-slate-800/50 text-slate-300 hover:text-purple-400 hover:border-purple-500/30 border border-slate-700/50'
          }`}
          aria-pressed={showStats}
          aria-label={`${showStats ? 'Hide' : 'Show'} statistics`}
        >
          <BarChart3 size={18} />
          Stats
        </button>
      </div>
    </header>
  );
};