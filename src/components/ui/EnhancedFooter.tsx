import React from 'react';
import { Zap } from 'lucide-react';

export const EnhancedFooter: React.FC = () => {
  return (
    <footer className="mt-12 text-center">
      <div className="inline-flex items-center gap-2 glass rounded-full px-6 py-3 border border-[#1e293b]/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
        <span className="text-gray-300 text-sm font-medium">Built with</span>
        <div className="flex items-center gap-1">
          <Zap size={16} className="text-blue-400 animate-pulse" />
          <span className="font-bold text-blue-400 neon-blue">Bolt</span>
          <Zap size={16} className="text-blue-400 animate-pulse" />
        </div>
        <span className="text-gray-300 text-sm font-medium">& a lot of rage</span>
        <span className="text-xl animate-bounce">🔥</span>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Transform your politeness into comedic fury!</p>
      </div>
    </footer>
  );
};