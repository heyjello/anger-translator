/**
 * Bleep Test Button Component
 * 
 * Standalone component for testing bleep functionality with translated text.
 */

import React, { useState } from 'react';
import { TestTube, Volume2, Loader2 } from 'lucide-react';
import { useBleepSound } from '../../hooks/useBleepSound';
import { enhancedTTSService } from '../../services/enhancedTTSService';

interface BleepTestButtonProps {
  translatedText?: string;
  className?: string;
}

export const BleepTestButton: React.FC<BleepTestButtonProps> = ({
  translatedText,
  className = ''
}) => {
  const [isTesting, setIsTesting] = useState(false);
  const { testBleep, isSupported } = useBleepSound();

  const handleTestBleep = async () => {
    setIsTesting(true);
    try {
      console.log('🧪 Testing bleep sound...');
      await testBleep();
    } catch (error) {
      console.error('❌ Bleep test failed:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestEnhancedTTS = async () => {
    if (!translatedText) return;
    
    setIsTesting(true);
    try {
      console.log('🧪 Testing enhanced TTS with translated text...');
      await enhancedTTSService.speakWithBleeps(translatedText, {
        style: 'ny-italian',
        rageLevel: 8,
        enableBleeps: true,
        bleepStyle: 'tv'
      });
    } catch (error) {
      console.error('❌ Enhanced TTS test failed:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestParsing = () => {
    if (!translatedText) return;
    
    console.log('🧪 Testing bleep parsing...');
    const segments = enhancedTTSService.testBleepParsing(translatedText);
    
    // Show results in console for debugging
    console.table(segments);
    
    // Also show in alert for user feedback
    const summary = segments.map((seg, i) => 
      `${i + 1}. ${seg.type.toUpperCase()}: "${seg.content}"`
    ).join('\n');
    
    alert(`Bleep Parsing Results:\n\n${summary}`);
  };

  if (!isSupported) {
    return (
      <div className={`text-xs text-gray-500 ${className}`}>
        Audio not supported
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleTestBleep}
        disabled={isTesting}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded hover:bg-orange-500/30 transition-all duration-300 disabled:opacity-50"
        title="Test basic bleep sound"
      >
        {isTesting ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <TestTube size={12} />
        )}
        Test Bleep
      </button>

      {translatedText && (
        <>
          <button
            onClick={handleTestEnhancedTTS}
            disabled={isTesting || !translatedText.includes('**')}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/30 transition-all duration-300 disabled:opacity-50"
            title="Test enhanced TTS with current translation"
          >
            {isTesting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Volume2 size={12} />
            )}
            Test TTS+Bleeps
          </button>

          <button
            onClick={handleTestParsing}
            disabled={!translatedText.includes('**')}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded hover:bg-purple-500/30 transition-all duration-300 disabled:opacity-50"
            title="Test bleep parsing (shows in console)"
          >
            📝 Parse
          </button>
        </>
      )}
    </div>
  );
};