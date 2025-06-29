/**
 * NavigationHeader Component
 * 
 * Header with navigation buttons for history and stats panels.
 * Provides clear visual feedback for active states and counts.
 */

import React from 'react';
import { History, BarChart3, Zap } from 'lucide-react';

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
    <header className="text-center mb-8 animate-fade-in">
      <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
        Anger Translator 🔥
      </h1>
      <p className="text-xl md:text-2xl text-white/90 font-medium drop-shadow-lg">
        Turn your polite words into comedic rage
      </p>
      
      <div className="mt-4 flex justify-center">
        <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 border border-white/30">
          <span className="text-white/80 text-sm font-medium flex items-center gap-2">
            <Zap size={16} className="text-yellow-300" />
            Powered by AI Magic
            <Zap size={16} className="text-yellow-300" />
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={onToggleHistory}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            showHistory 
              ? 'bg-white text-purple-600 shadow-lg' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
          aria-pressed={showHistory}
          aria-label={`${showHistory ? 'Hide' : 'Show'} translation history`}
        >
          <History size={18} />
          History ({historyCount})
        </button>
        <button
          onClick={onToggleStats}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            showStats 
              ? 'bg-white text-purple-600 shadow-lg' 
              : 'bg-white/20 text-white hover:bg-white/30'
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