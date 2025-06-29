import React, { useState, useCallback } from 'react';
import { HistoryPanel, type TranslationHistory } from '../components';

interface HistoryContainerProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const HistoryContainer: React.FC<HistoryContainerProps> = ({
  isVisible,
  onToggleVisibility
}) => {
  const [translationHistory, setTranslationHistory] = useState<TranslationHistory[]>([]);

  // Add to history
  const addToHistory = useCallback((original: string, translated: string, style: string, level: number) => {
    const newItem: TranslationHistory = {
      id: Date.now().toString(),
      originalText: original,
      translatedText: translated,
      style,
      rageLevel: level,
      timestamp: new Date()
    };
    
    setTranslationHistory(prev => [newItem, ...prev.slice(0, 19)]); // Keep last 20 items
  }, []);

  // Handle copy to clipboard
  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('📋 Text copied to clipboard');
    } catch (error) {
      console.error('❌ Failed to copy text:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (fallbackError) {
        console.error('❌ Fallback copy failed:', fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  // Handle history item reuse
  const handleReuseHistoryItem = (item: TranslationHistory) => {
    // This would typically communicate back to the translation container
    // For now, we'll just close the history panel
    onToggleVisibility();
    
    // In a more complex app, you might use a state management solution
    // or lift this state up to a common parent
    console.log('Reusing history item:', item);
  };

  // Handle share from history
  const handleShareFromHistory = (item: TranslationHistory) => {
    // This would typically trigger a share modal
    console.log('Sharing history item:', item);
  };

  // Clear all history
  const handleClearHistory = () => {
    setTranslationHistory([]);
  };

  // Expose methods for parent components
  React.useImperativeHandle(React.useRef(), () => ({
    addToHistory,
    getHistoryCount: () => translationHistory.length
  }));

  if (!isVisible) return null;

  return (
    <div className="mb-8 animate-fade-in">
      <HistoryPanel
        history={translationHistory}
        onClear={handleClearHistory}
        onCopyTranslation={handleCopyToClipboard}
        onShareTranslation={handleShareFromHistory}
        onReuse={handleReuseHistoryItem}
      />
    </div>
  );
};