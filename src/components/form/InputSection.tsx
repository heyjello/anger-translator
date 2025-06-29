/**
 * InputSection Component
 * 
 * Handles text input with validation, character counting, and user guidance.
 * Provides real-time feedback and maintains input constraints.
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  maxChars: number;
  minChars: number;
  isLoading: boolean;
  placeholder?: string;
}

export const InputSection: React.FC<InputSectionProps> = ({
  value,
  onChange,
  error,
  maxChars,
  minChars,
  isLoading,
  placeholder = "Enter your polite message here... (e.g., 'Could you please fix this when you have a moment?')"
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    
    // Enforce character limit
    if (newText.length > maxChars) {
      return;
    }
    
    onChange(newText);
  };

  const getCharacterCountColor = () => {
    const percentage = (value.length / maxChars) * 100;
    if (percentage >= 90) return 'text-red-400 font-bold neon-red';
    if (percentage >= 75) return 'text-orange-400 font-semibold';
    return 'text-gray-400';
  };

  return (
    <div className="mb-8">
      <label className="block text-xl font-bold text-gray-100 mb-3 flex items-center gap-2">
        <span className="text-2xl">💬</span>
        Enter your polite message:
      </label>
      
      <div className="relative">
        <textarea
          value={value}
          onChange={handleInputChange}
          className={`w-full h-36 p-6 border-2 rounded-xl resize-none focus:ring-4 transition-all duration-300 text-lg placeholder-gray-500 bg-[#0a0f1b] text-gray-100 ${
            error 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
              : 'border-[#1e293b] focus:border-blue-500 focus:ring-blue-500/30 focus:shadow-[0_0_20px_rgba(59,130,246,0.3)]'
          }`}
          placeholder={placeholder}
          disabled={isLoading}
          aria-describedby={error ? 'input-error' : undefined}
        />
        <div className={`absolute bottom-3 right-3 text-sm font-medium ${getCharacterCountColor()}`}>
          {value.length}/{maxChars}
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div id="input-error" className="mt-3 flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3 animate-slide-in">
          <AlertCircle size={18} />
          <span className="font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};