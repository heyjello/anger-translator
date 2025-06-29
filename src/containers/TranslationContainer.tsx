import React, { useState, useCallback } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { 
  InputSection,
  StyleSelector,
  RageSlider,
  TranslateButton,
  OutputSection,
  ErrorDisplay
} from '../components';
import { ParticleEffect } from '../components/ui/ParticleEffect';
import { RageStyle } from '../types/translation';

const MAX_CHARACTERS = 500;
const MIN_CHARACTERS = 5;

interface TranslationContainerProps {
  onTranslationComplete?: (original: string, translated: string, style: string, level: number) => void;
}

export const TranslationContainer: React.FC<TranslationContainerProps> = ({
  onTranslationComplete
}) => {
  // State management
  const [inputText, setInputText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<RageStyle>('corporate');
  const [rageLevel, setRageLevel] = useState(5);
  const [isCopied, setIsCopied] = useState(false);
  const [inputError, setInputError] = useState('');
  const [showParticles, setShowParticles] = useState(false);

  // Translation hook
  const { 
    translate, 
    isLoading, 
    result: outputText, 
    error: translationError, 
    isRateLimited,
    timeUntilNextRequest,
    clearResult,
    clearError 
  } = useTranslation();

  // Input validation
  const validateInput = (text: string): string => {
    if (!text.trim()) {
      return 'Please enter a message to translate';
    }
    if (text.trim().length < MIN_CHARACTERS) {
      return `Message must be at least ${MIN_CHARACTERS} characters long`;
    }
    if (text.length > MAX_CHARACTERS) {
      return `Message cannot exceed ${MAX_CHARACTERS} characters`;
    }
    return '';
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = async (text?: string) => {
    const textToCopy = text || outputText;
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      console.log('📋 Text copied to clipboard');
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('❌ Failed to copy text:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (fallbackError) {
        console.error('❌ Fallback copy failed:', fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  // Handle translation with validation
  const handleTranslate = async () => {
    console.log('🔥 Translate clicked!', { inputText, selectedStyle, rageLevel });
    
    const error = validateInput(inputText);
    if (error) {
      setInputError(error);
      console.log('❌ Validation failed:', error);
      return;
    }

    setIsCopied(false);
    setInputError('');
    clearError();
    
    // Trigger particle effect
    setShowParticles(true);
    
    console.log('⏳ Starting translation...');

    // Call the translation service
    await translate({
      text: inputText,
      style: selectedStyle,
      intensity: rageLevel
    });

    // Notify parent component of successful translation
    if (outputText && onTranslationComplete) {
      onTranslationComplete(inputText, outputText, selectedStyle, rageLevel);
    }
  };

  // Handle input change with validation
  const handleInputChange = (newText: string) => {
    console.log('✏️ Input changed:', newText.length, 'characters');
    setInputText(newText);
    
    if (inputError) {
      setInputError('');
    }
    if (translationError) {
      clearError();
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return inputText.trim().length >= MIN_CHARACTERS && 
           inputText.length <= MAX_CHARACTERS && 
           !isLoading &&
           !isRateLimited;
  };

  // Handle clear output
  const handleClearOutput = () => {
    clearResult();
    setIsCopied(false);
  };

  // Get validation message for button
  const getValidationMessage = () => {
    if (inputText.trim().length < MIN_CHARACTERS) {
      return `Enter at least ${MIN_CHARACTERS} characters to translate`;
    }
    return undefined;
  };

  return (
    <>
      {/* Particle Effect */}
      <ParticleEffect 
        isActive={showParticles} 
        onComplete={() => setShowParticles(false)} 
      />

      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 md:p-8 max-w-7xl mx-auto">
        
        {/* Rate Limit Warning */}
        {isRateLimited && (
          <div className="mb-6">
            <ErrorDisplay
              type="warning"
              message={`Please wait ${timeUntilNextRequest} seconds before translating again.`}
            />
          </div>
        )}

        {/* Translation Error */}
        {translationError && !isRateLimited && (
          <div className="mb-6">
            <ErrorDisplay
              type="error"
              message={translationError}
              onDismiss={clearError}
            />
          </div>
        )}
        
        {/* Input Section */}
        <InputSection
          value={inputText}
          onChange={handleInputChange}
          error={inputError}
          maxChars={MAX_CHARACTERS}
          minChars={MIN_CHARACTERS}
          isLoading={isLoading}
        />

        {/* Style Selector */}
        <StyleSelector
          selectedStyle={selectedStyle}
          onStyleSelect={setSelectedStyle}
          isLoading={isLoading}
        />

        {/* Rage Slider */}
        <RageSlider
          value={rageLevel}
          onChange={setRageLevel}
          isLoading={isLoading}
        />

        {/* Translate Button */}
        <TranslateButton
          onTranslate={handleTranslate}
          isValid={isFormValid()}
          isLoading={isLoading}
          isRateLimited={isRateLimited}
          timeUntilNext={timeUntilNextRequest}
          validationMessage={getValidationMessage()}
        />

        {/* Output Area */}
        <OutputSection
          outputText={outputText}
          onCopy={() => handleCopyToClipboard()}
          onClear={handleClearOutput}
          onShare={() => {}} // Will be handled by parent
          isCopied={isCopied}
          isLoading={isLoading}
        />

      </div>
    </>
  );
};