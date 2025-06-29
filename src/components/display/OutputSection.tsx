/**
 * OutputSection Component
 * 
 * Updated to include bleep testing functionality for debugging.
 */

import React from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import { TTSButton } from '../ui/TTSButton';
import { BleepTestButton } from '../ui/BleepTestButton';

interface OutputSectionProps {
  outputText: string;
  onCopy: () => void;
  onClear: () => void;
  onShare: () => void;
  isCopied: boolean;
  isLoading: boolean;
  // TTS props
  translationStyle?: string;
  rageLevel?: number;
}

export const OutputSection: React.FC<OutputSectionProps> = ({
  outputText,
  onCopy,
  onClear,
  onShare,
  isCopied,
  isLoading,
  translationStyle = 'default',
  rageLevel = 5
}) => {
  const hasBleeps = outputText.includes('**');

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-xl font-bold text-gray-100 flex items-center gap-2">
          <span className="text-2xl">💥</span>
          Your translated rage:
          {hasBleeps && (
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30">
              Contains Bleeps
            </span>
          )}
        </label>
        {outputText && (
          <div className="flex items-center gap-2">
            {/* Text-to-Speech Button with Bleep Support */}
            <TTSButton
              text={outputText}
              style={translationStyle}
              rageLevel={rageLevel}
              size="md"
              variant="default"
            />
            
            <button
              onClick={onShare}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-300 border border-transparent hover:border-blue-500/30"
              aria-label="Share translation"
            >
              <Share2 size={16} />
              Share
            </button>
            <button
              onClick={onClear}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 transition-all duration-300 border border-transparent hover:border-gray-500/30"
              aria-label="Clear output"
            >
              Clear
            </button>
            <button
              onClick={onCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 border-2 ${
                isCopied
                  ? 'bg-green-500/20 text-green-400 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                  : 'bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30 hover:border-blue-500/70 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'
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
          ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)]' 
          : 'bg-[#0a0f1b]/50 border-[#1e293b] shadow-inner'
      }`}>
        {outputText ? (
          <div className="animate-slide-in">
            <div className="text-gray-100 font-bold text-lg leading-relaxed">
              {outputText}
            </div>
            
            {/* Bleep Testing Section (only show if there are bleeps) */}
            {hasBleeps && (
              <div className="mt-4 pt-4 border-t border-gray-600/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    🔊 Bleep Testing:
                  </span>
                  <BleepTestButton 
                    translatedText={outputText}
                    className="flex-shrink-0"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 italic text-lg flex items-center justify-center h-28">
            {isLoading ? (
              <span className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
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