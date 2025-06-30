import React, { useState, useCallback } from 'react';
import { useEnhancedTranslation } from './hooks/useEnhancedTranslation';
import { 
  BackgroundAnimation,
  ErrorDisplay,
  InputSection,
  NavigationHeader,
  OutputSection,
  StyleSelector,
  TranslateButton,
  ShareModal,
  HistoryPanel,
  StatsPanel,
  type TranslationHistory
} from './components';
import { ParticleEffect, EnhancedFooter, AIStatusIndicator } from './components/ui';
import { CircularRageMeter } from './components/ui/CircularRageMeter';
import { RageStyle } from './types/translation';
import './App.css';

const MAX_CHARACTERS = 500;
const MIN_CHARACTERS = 5;

function App() {
  // State management
  const [inputText, setInputText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<RageStyle>('enforcer');
  const [rageLevel, setRageLevel] = useState(5); // Now 1-10 scale
  const [isCopied, setIsCopied] = useState(false);
  const [inputError, setInputError] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [translationHistory, setTranslationHistory] = useState<TranslationHistory[]>([]);
  const [showParticles, setShowParticles] = useState(false);

  // Enhanced translation hook with AI capabilities
  const { 
    translate, 
    isLoading, 
    result: outputText,
    rawResult: rawOutputText, // Raw text with audio tags for TTS
    error: translationError, 
    isRateLimited,
    timeUntilNextRequest,
    clearResult,
    clearError,
    usedAI,
    aiModel,
    isAIAvailable,
    serviceStatus,
    refreshAIStatus,
    setUseAI
  } = useEnhancedTranslation();

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
      
      // Reset the copied state after 2 seconds
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

  // Handle translation with validation
  const handleTranslate = async () => {
    console.log('🔥 Translate clicked!', { inputText, selectedStyle, rageLevel });
    
    const error = validateInput(inputText);
    if (error) {
      setInputError(error);
      console.log('❌ Validation failed:', error);
      return;
    }

    setIsCopied(false); // Reset copy state when translating
    setInputError(''); // Clear any previous errors
    clearError(); // Clear any previous translation errors
    
    // Trigger particle effect
    setShowParticles(true);
    
    console.log('⏳ Starting translation...');

    // Call the enhanced translation service
    await translate({
      text: inputText,
      style: selectedStyle,
      intensity: rageLevel * 10 // Convert 1-10 to 10-100 for internal processing
    });
  };

  // Add to history when translation completes successfully
  React.useEffect(() => {
    if (outputText && inputText) {
      addToHistory(inputText, outputText, selectedStyle, rageLevel);
    }
  }, [outputText, inputText, selectedStyle, rageLevel, addToHistory]);

  // Handle input change with validation
  const handleInputChange = (newText: string) => {
    console.log('✏️ Input changed:', newText.length, 'characters');
    setInputText(newText);
    
    // Clear error when user starts typing
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

  // Handle share
  const handleShare = () => {
    if (outputText) {
      setShowShareModal(true);
    }
  };

  // Handle history item reuse
  const handleReuseHistoryItem = (item: TranslationHistory) => {
    setInputText(item.originalText);
    setSelectedStyle(item.style as RageStyle);
    setRageLevel(item.rageLevel);
    setShowHistory(false);
  };

  // Handle share from history
  const handleShareFromHistory = (item: TranslationHistory) => {
    // Temporarily set the output to share
    setShowShareModal(true);
  };

  // Get validation message for button
  const getValidationMessage = () => {
    if (inputText.trim().length < MIN_CHARACTERS) {
      return `Enter at least ${MIN_CHARACTERS} characters to translate`;
    }
    return undefined;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <BackgroundAnimation />

      {/* Particle Effect */}
      <ParticleEffect 
        isActive={showParticles} 
        onComplete={() => setShowParticles(false)} 
      />

      <div className="w-full relative z-10 px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <NavigationHeader
          historyCount={translationHistory.length}
          showHistory={showHistory}
          showStats={showStats}
          onToggleHistory={() => setShowHistory(!showHistory)}
          onToggleStats={() => setShowStats(!showStats)}
        />

        {/* AI Status Indicator - HIDDEN */}
        <div className="flex justify-center mb-6 hidden">
          <AIStatusIndicator
            isAIAvailable={isAIAvailable}
            usedAI={usedAI}
            aiModel={aiModel}
            serviceStatus={serviceStatus}
            onRefreshStatus={refreshAIStatus}
            onToggleAI={setUseAI}
          />
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="mb-8 animate-fade-in">
            <HistoryPanel
              history={translationHistory}
              onClear={() => setTranslationHistory([])}
              onCopyTranslation={handleCopyToClipboard}
              onShareTranslation={handleShareFromHistory}
              onReuse={handleReuseHistoryItem}
            />
          </div>
        )}

        {/* Stats Panel */}
        {showStats && (
          <div className="mb-8 animate-fade-in">
            <StatsPanel history={translationHistory} />
          </div>
        )}

        {/* Main Content - Voice Editor Layout */}
        <div className="max-w-6xl mx-auto">
          
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

          {/* Voice Editor Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Panel - Input & Controls */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Input Section */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                <InputSection
                  value={inputText}
                  onChange={handleInputChange}
                  error={inputError}
                  maxChars={MAX_CHARACTERS}
                  minChars={MIN_CHARACTERS}
                  isLoading={isLoading}
                />
              </div>

              {/* Style Selector */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                <StyleSelector
                  selectedStyle={selectedStyle}
                  onStyleSelect={setSelectedStyle}
                  isLoading={isLoading}
                />
              </div>

            </div>

            {/* Center Panel - Circular Rage Meter */}
            <div className="lg:col-span-1 flex items-center justify-center">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 w-full max-w-md">
                <CircularRageMeter
                  value={rageLevel}
                  onChange={setRageLevel}
                  isLoading={isLoading}
                  onTranslate={handleTranslate}
                  isValid={isFormValid()}
                  isRateLimited={isRateLimited}
                  timeUntilNext={timeUntilNextRequest}
                  validationMessage={getValidationMessage()}
                />
              </div>
            </div>

            {/* Right Panel - Output */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 h-full">
                <OutputSection
                  outputText={outputText}
                  rawText={rawOutputText} // Pass raw text for TTS
                  onCopy={() => handleCopyToClipboard()}
                  onClear={handleClearOutput}
                  onShare={handleShare}
                  isCopied={isCopied}
                  isLoading={isLoading}
                  translationStyle={selectedStyle}
                  rageLevel={rageLevel}
                />
              </div>
            </div>

          </div>

        </div>

        {/* Enhanced Footer */}
        <EnhancedFooter />

      </div>

      {/* Share Modal */}
      {showShareModal && outputText && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          translatedText={outputText}
          originalText={inputText}
          style={selectedStyle}
          rageLevel={rageLevel}
        />
      )}
    </div>
  );
}

export default App;