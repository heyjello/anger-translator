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
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={24} className="text-gray-600" />
          <h3 className="text-xl font-bold text-gray-800">Translation History</h3>
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
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock size={24} className="text-gray-600" />
          <h3 className="text-xl font-bold text-gray-800">Translation History</h3>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
            {history.length}
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-300"
        >
          <Trash2 size={16} />
          Clear All
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {history.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => onReuse(item)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  {item.style} • Level {item.rageLevel}
                </span>
                <span className="text-xs text-gray-400">
                  {item.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyTranslation(item.translatedText);
                  }}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Copy translation"
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShareTranslation(item);
                  }}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Share translation"
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">Original:</p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {item.originalText}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Translation:</p>
                <p className="text-sm font-medium text-gray-800 line-clamp-2">
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