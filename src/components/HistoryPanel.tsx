import React from 'react';
import { Clock, Trash2, Copy, Share2 } from 'lucide-react';

export interface TranslationHistory {
  id: string;
  originalText: string;
  translatedText: string;
  style: string;
  rageLevel: number;
  timestamp: Date;
}

interface HistoryPanelProps {
  history: TranslationHistory[];
  onClear: () => void;
  onCopyTranslation: (text: string) => void;
  onShareTranslation: (item: TranslationHistory) => void;
  onReuse: (item: TranslationHistory) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onClear,
  onCopyTranslation,
  onShareTranslation,
  onReuse
}) => {
  if (history.length === 0) {
    return (
      <div className="cyber-card rounded-2xl shadow-cyber p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={24} className="text-gray-400" />
          <h3 className="text-xl font-bold text-gray-100">Translation History</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Clock size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No translations yet</p>
          <p className="text-sm">Your translation history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cyber-card rounded-2xl shadow-cyber p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock size={24} className="text-gray-400" />
          <h3 className="text-xl font-bold text-gray-100">Translation History</h3>
          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-sm font-medium border border-blue-500/30">
            {history.length}
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300 border border-transparent hover:border-red-500/30"
        >
          <Trash2 size={16} />
          Clear All
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {history.map((item) => (
          <div
            key={item.id}
            className="border border-[#1e293b] rounded-xl p-4 hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all duration-300 cursor-pointer bg-[#0a0f1b]/30"
            onClick={() => onReuse(item)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-400">
                  {item.style} • Level {item.rageLevel}
                </span>
                <span className="text-xs text-gray-500">
                  {item.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyTranslation(item.translatedText);
                  }}
                  className="p-1 hover:bg-blue-500/20 hover:text-blue-400 rounded transition-colors text-gray-500"
                  title="Copy translation"
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShareTranslation(item);
                  }}
                  className="p-1 hover:bg-purple-500/20 hover:text-purple-400 rounded transition-colors text-gray-500"
                  title="Share translation"
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">Original:</p>
                <p className="text-sm text-gray-300 line-clamp-2">
                  {item.originalText}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Translation:</p>
                <p className="text-sm font-medium text-gray-100 line-clamp-2">
                  {item.translatedText}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};