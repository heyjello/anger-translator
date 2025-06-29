/**
 * AI Status Indicator Component
 * 
 * Shows the current AI service status and allows configuration.
 * Optimized for Mixtral-8x7b-instruct display.
 */

import React, { useState } from 'react';
import { Settings, Zap, ZapOff, CheckCircle, AlertCircle, Cpu } from 'lucide-react';
import { openRouterService, AVAILABLE_MODELS, type ModelId } from '../../services/openRouterService';

interface AIStatusIndicatorProps {
  isAIAvailable: boolean;
  usedAI: boolean;
  aiModel?: string;
  serviceStatus: {
    aiAvailable: boolean;
    usingAI: boolean;
    model?: string;
    service: 'openrouter' | 'mock';
  };
  onRefreshStatus: () => void;
  onToggleAI: (useAI: boolean) => void;
}

export const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({
  isAIAvailable,
  usedAI,
  aiModel,
  serviceStatus,
  onRefreshStatus,
  onToggleAI
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelId>('mistralai/mixtral-8x7b-instruct');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [configError, setConfigError] = useState('');

  const handleConfigure = async () => {
    if (!apiKey.trim()) {
      setConfigError('Please enter your OpenRouter API key');
      return;
    }

    setIsConfiguring(true);
    setConfigError('');

    try {
      // Configure the service
      openRouterService.configure(apiKey, selectedModel);
      
      // Test the connection
      const testResult = await openRouterService.testConnection();
      
      if (testResult.success) {
        setShowConfig(false);
        setApiKey('');
        onRefreshStatus();
        console.log('✅ AI service configured successfully');
      } else {
        setConfigError(testResult.error || 'Configuration test failed');
      }
    } catch (error) {
      setConfigError(error instanceof Error ? error.message : 'Configuration failed');
    } finally {
      setIsConfiguring(false);
    }
  };

  const getStatusIcon = () => {
    if (isAIAvailable && serviceStatus.usingAI) {
      return <CheckCircle size={16} className="text-green-500" />;
    } else if (isAIAvailable) {
      return <Zap size={16} className="text-blue-500" />;
    } else {
      return <ZapOff size={16} className="text-gray-400" />;
    }
  };

  const getStatusText = () => {
    if (isAIAvailable && serviceStatus.usingAI) {
      return `AI Active (${serviceStatus.model?.split('/')[1]?.split('-')[0] || 'Unknown'})`;
    } else if (isAIAvailable) {
      return 'AI Available';
    } else {
      return 'Mock Mode';
    }
  };

  const getStatusColor = () => {
    if (isAIAvailable && serviceStatus.usingAI) {
      return 'bg-green-100 border-green-300 text-green-800';
    } else if (isAIAvailable) {
      return 'bg-blue-100 border-blue-300 text-blue-800';
    } else {
      return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  const getCurrentModelInfo = () => {
    const currentModel = serviceStatus.model as ModelId;
    return AVAILABLE_MODELS[currentModel] || AVAILABLE_MODELS['mistralai/mixtral-8x7b-instruct'];
  };

  return (
    <div className="relative">
      {/* Status Indicator */}
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="font-medium text-sm">{getStatusText()}</span>
        
        {/* Model info for Mixtral */}
        {serviceStatus.model === 'mistralai/mixtral-8x7b-instruct' && (
          <div className="flex items-center gap-1 ml-2">
            <Cpu size={14} />
            <span className="text-xs font-bold">MIXTRAL</span>
          </div>
        )}
        
        {/* Toggle Switch */}
        {isAIAvailable && (
          <button
            onClick={() => onToggleAI(!serviceStatus.usingAI)}
            className={`ml-2 w-8 h-4 rounded-full transition-all duration-300 ${
              serviceStatus.usingAI ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 ${
              serviceStatus.usingAI ? 'translate-x-4' : 'translate-x-0.5'
            }`} />
          </button>
        )}
        
        {/* Settings Button */}
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="ml-2 p-1 hover:bg-white/50 rounded transition-colors"
          title="Configure AI Service"
        >
          <Settings size={14} />
        </button>
      </div>

      {/* Last Translation Info */}
      {usedAI && aiModel && (
        <div className="mt-2 text-xs text-center text-gray-600">
          Last translation: {aiModel}
        </div>
      )}

      {/* Configuration Modal */}
      {showConfig && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Cpu size={20} />
              AI Configuration
            </h3>
            <button
              onClick={() => setShowConfig(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Current Status */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">Current Status:</div>
            <div className="flex items-center gap-2 text-sm">
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>
            {isAIAvailable && (
              <div className="mt-2 text-xs text-gray-600">
                Model: {getCurrentModelInfo().name}
              </div>
            )}
          </div>

          {/* API Key Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenRouter API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="mt-1 text-xs text-gray-500">
              Get your API key from{' '}
              <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                openrouter.ai
              </a>
            </div>
          </div>

          {/* Model Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as ModelId)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(AVAILABLE_MODELS).map(([id, model]) => (
                <option key={id} value={id}>
                  {model.name} {model.recommended ? '⭐' : ''} 
                  {id === 'mistralai/mixtral-8x7b-instruct' ? ' (Your Choice)' : ''}
                  {model.costPer1kTokens === 0 ? ' (Free)' : ` ($${model.costPer1kTokens}/1k tokens)`}
                </option>
              ))}
            </select>
            
            {/* Model Info */}
            {AVAILABLE_MODELS[selectedModel] && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800">
                  {AVAILABLE_MODELS[selectedModel].name}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  {AVAILABLE_MODELS[selectedModel].description}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Strengths: {AVAILABLE_MODELS[selectedModel].strengths.join(', ')}
                </div>
                {selectedModel === 'mistralai/mixtral-8x7b-instruct' && (
                  <div className="text-xs font-bold text-blue-800 mt-1">
                    🎯 Excellent choice for creative rage translations!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error Display */}
          {configError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle size={16} />
                <span className="text-sm">{configError}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleConfigure}
              disabled={isConfiguring || !apiKey.trim()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isConfiguring ? 'Testing...' : 'Configure & Test'}
            </button>
            <button
              onClick={() => {
                openRouterService.clearConfiguration();
                onRefreshStatus();
                setShowConfig(false);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-4 text-xs text-gray-500">
            💡 Tip: Mixtral-8x7b-instruct is excellent for creative and humorous text generation, 
            making it perfect for rage translations!
          </div>
        </div>
      )}
    </div>
  );
};