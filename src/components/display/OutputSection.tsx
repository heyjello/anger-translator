/**
 * OutputSection Component
 * 
 * Displays the translated text with action buttons for copy, clear, and share.
 * Handles loading states and provides visual feedback for user actions.
 */

import React from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

interface OutputSectionProps {
  outputText: string;
  onCopy: () => void;
  onClear: () => void;
  onShare: () => void;
  isCopied: boolean;
  isLoading: boolean;
}

export const OutputSection: React.FC<OutputSectionProps> = ({
  outputText,
  onCopy,
  onClear,
  onShare,
  isCopied,
  isLoading
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">💥</span>
          Your translated rage:
        </label>
        {outputText && (
          <div className="flex items-center gap-2">
            <button
              onClick={onShare}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-all duration-300"
              aria-label="Share translation"
            >
              <Share2 size={16} />
              Share
            </button>
            <button
              onClick={onClear}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300"
              aria-label="Clear output"
            >
              Clear
            </button>
            <button
              onClick={onCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                isCopied
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : 'bg-blue-100 text-blue-700 border-2 border-blue-300 hover:bg-blue-200 hover:border-blue-400'
              }`}
              aria-label={isCopied ? 'Copied!' : 'Copy to clipboard'}
            >
              {isCopied ? (
                <>
                  <Check size={18} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={18} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
      
      <div className={`w-full min-h-40 p-6 rounded-xl border-2 transition-all duration-500 ${
        outputText 
          ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-lg' 
          : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-inner'
      }`}>
        {outputText ? (
          <div className="animate-slide-in">
            <div className="text-gray-800 font-bold text-lg leading-relaxed">
              {outputText}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 italic text-lg flex items-center justify-center h-28">
            {isLoading ? (
              <span className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                Translating your rage...
              </span>
            ) : (
              'Your rage will appear here...'
            )}
          </div>
        )}
      </div>
    </div>
  );
};