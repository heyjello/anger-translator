import React from 'react';
import { BarChart3, TrendingUp, Award, Zap } from 'lucide-react';
import { TranslationHistory } from './HistoryPanel';

interface StatsPanelProps {
  history: TranslationHistory[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ history }) => {
  const totalTranslations = history.length;
  const averageRageLevel = history.length > 0 
    ? (history.reduce((sum, item) => sum + item.rageLevel, 0) / history.length).toFixed(1)
    : '0';
  
  const styleStats = history.reduce((acc, item) => {
    acc[item.style] = (acc[item.style] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const favoriteStyle = Object.entries(styleStats).reduce(
    (max, [style, count]) => count > max.count ? { style, count } : max,
    { style: 'None', count: 0 }
  );

  const maxRageLevel = history.length > 0 
    ? Math.max(...history.map(item => item.rageLevel))
    : 0;

  const getStyleEmoji = (style: string) => {
    switch (style) {
      case 'corporate': return '💼';
      case 'gamer': return '🎮';
      case 'sarcastic': return '😏';
      default: return '🎭';
    }
  };

  return (
    <div className="cyber-card rounded-2xl shadow-cyber p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 size={24} className="text-gray-400" />
        <h3 className="text-xl font-bold text-gray-100">Your Rage Stats</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-4 border border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Total Translations</span>
          </div>
          <div className="text-2xl font-bold text-blue-100">{totalTranslations}</div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl p-4 border border-red-500/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={20} className="text-red-400" />
            <span className="text-sm font-medium text-red-300">Avg Rage Level</span>
          </div>
          <div className="text-2xl font-bold text-red-100">{averageRageLevel}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-4 border border-purple-500/30 hover:shadow-[0_0_20px_rgba(147,51,234,0.2)] transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Award size={20} className="text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Favorite Style</span>
          </div>
          <div className="text-lg font-bold text-purple-100 flex items-center gap-1">
            <span>{getStyleEmoji(favoriteStyle.style)}</span>
            <span className="capitalize">{favoriteStyle.style}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-4 border border-orange-500/30 hover:shadow-[0_0_20px_rgba(251,146,60,0.2)] transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-400 text-xl">🔥</span>
            <span className="text-sm font-medium text-orange-300">Max Rage</span>
          </div>
          <div className="text-2xl font-bold text-orange-100">{maxRageLevel}/10</div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Style Breakdown</h4>
          <div className="space-y-2">
            {Object.entries(styleStats).map(([style, count]) => (
              <div key={style} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{getStyleEmoji(style)}</span>
                  <span className="text-sm capitalize text-gray-300">{style}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-[#1e293b] rounded-full h-2 w-16 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                      style={{ width: `${(count / totalTranslations) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-400">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};