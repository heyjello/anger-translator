/**
 * OpenRouterSetup Component
 * 
 * Configuration modal for setting up OpenRouter API integration.
 * Allows users to enter their API key and select AI models.
 */

import React, { useState, useEffect } from 'react';
import { X, Key, Zap, ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { openRouterService, AVAILABLE_MODELS, type ModelId } from '../../services/openRouterService';

interface OpenRouterSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigured?: () => void;
}

export const OpenRouterSetup: React.FC<OpenRouterSetupProps> = ({
  isOpen,
  onClose,
  onConfigured
}) => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelId>('anthropic/claude-3-haiku');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; error?: string } | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const status = openRouterService.getStatus();
      if (status.hasApiKey) {
        setApiKey('••••••••••••••••'); // Masked for security
      }
      setSelectedModel(status.model as ModelId);
      setTestResult(null);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!apiKey || apiKey === '••••••••••••••••') {
      alert('Please enter a valid API key');
      return;
    }

    openRouterService.configure(apiKey, selectedModel);
    
    // Test the connection
    setIsTestingConnection(true);
    setTestResult(null);
    
    try {
      const result = await openRouterService.testConnection();
      setTestResult(result);
      
      if (result.success) {
        setTimeout(() => {
          onConfigured?.();
          onClose();
        }, 1500);
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Connection test failed'
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleClearConfig = () => {
    openRouterService.clearConfiguration();
    setApiKey('');
    setTestResult(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">OpenRouter AI Setup</h3>
              <p className="text-gray-600">Configure real AI translation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-blue-500 rounded-full">
              <Key size={16} className="text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">What is OpenRouter?</h4>
              <p className="text-blue-800 text-sm mb-3">
                OpenRouter provides access to multiple AI models (GPT-4, Claude, Llama) through a single API. 
                It's cost-effective and gives you access to the latest AI models.
              </p>
              <a
                href="https://openrouter.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Get your API key at OpenRouter.ai
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* API Key Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OpenRouter API Key
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-20"
              placeholder="sk-or-v1-..."
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showApiKey ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Your API key is stored locally and never sent to our servers
          </p>
        </div>

        {/* Model Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            AI Model
          </label>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(AVAILABLE_MODELS).map(([modelId, model]) => (
              <button
                key={modelId}
                onClick={() => setSelectedModel(modelId as ModelId)}
                className={`p-4 border-2 rounded-xl text-left transition-all duration-300 ${
                  selectedModel === modelId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">{model.name}</h4>
                    <p className="text-sm text-gray-600">{model.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">
                      {model.costPer1kTokens === 0 ? 'Free' : `$${model.costPer1kTokens}/1k tokens`}
                    </div>
                    <div className="text-xs text-gray-500">
                      Max: {model.maxTokens} tokens
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Test Result */}
        {testResult && (
          <div className={`mb-6 p-4 rounded-xl border ${
            testResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle size={20} className="text-green-600" />
              ) : (
                <AlertCircle size={20} className="text-red-600" />
              )}
              <span className={`font-medium ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.success ? 'Connection successful!' : 'Connection failed'}
              </span>
            </div>
            {testResult.error && (
              <p className="text-red-700 text-sm mt-1">{testResult.error}</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={!apiKey || apiKey === '••••••••••••••••' || isTestingConnection}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isTestingConnection ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <Zap size={18} />
                Save & Test
              </>
            )}
          </button>
          
          <button
            onClick={handleClearConfig}
            className="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Clear
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Pricing Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-800 mb-2">💡 Cost Information</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Most translations cost less than $0.001 (1/10th of a cent)</p>
            <p>• Free models available for testing</p>
            <p>• Pay only for what you use, no subscriptions</p>
            <p>• Typical usage: 100 translations ≈ $0.05-$0.50 depending on model</p>
          </div>
        </div>
      </div>
    </div>
  );
};