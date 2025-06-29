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
      <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-4 animate-neon-glow">
        Anger Translator 🔥
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 font-medium drop-shadow-lg">
        Turn your polite words into comedic rage
      </p>
      
      <div className="mt-4 flex justify-center">
        <div className="glass rounded-full px-6 py-2 border border-[#1e293b]/50 animate-cyber-pulse">
          <span className="text-gray-300 text-sm font-medium flex items-center gap-2">
            <Zap size={16} className="text-blue-400 animate-pulse" />
            Powered by AI Magic
            <Zap size={16} className="text-blue-400 animate-pulse" />
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={onToggleHistory}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            showHistory 
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
              : 'glass text-gray-300 hover:text-blue-400 hover:border-blue-500/30'
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
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50 shadow-[0_0_20px_rgba(147,51,234,0.3)]' 
              : 'glass text-gray-300 hover:text-purple-400 hover:border-purple-500/30'
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