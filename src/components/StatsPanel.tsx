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
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 size={24} className="text-gray-600" />
        <h3 className="text-xl font-bold text-gray-800">Your Rage Stats</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Total Translations</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{totalTranslations}</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={20} className="text-red-600" />
            <span className="text-sm font-medium text-red-800">Avg Rage Level</span>
          </div>
          <div className="text-2xl font-bold text-red-900">{averageRageLevel}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Award size={20} className="text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Favorite Style</span>
          </div>
          <div className="text-lg font-bold text-purple-900 flex items-center gap-1">
            <span>{getStyleEmoji(favoriteStyle.style)}</span>
            <span className="capitalize">{favoriteStyle.style}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-600 text-xl">🔥</span>
            <span className="text-sm font-medium text-orange-800">Max Rage</span>
          </div>
          <div className="text-2xl font-bold text-orange-900">{maxRageLevel}/10</div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Style Breakdown</h4>
          <div className="space-y-2">
            {Object.entries(styleStats).map(([style, count]) => (
              <div key={style} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{getStyleEmoji(style)}</span>
                  <span className="text-sm capitalize text-gray-700">{style}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-200 rounded-full h-2 w-16">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(count / totalTranslations) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};