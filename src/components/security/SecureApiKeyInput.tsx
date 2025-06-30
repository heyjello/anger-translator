/**
 * Secure API Key Input Component
 * 
 * Provides secure input for API keys with validation and proper handling.
 */

import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { secureKeyManager } from '../../services/secureKeyManager';

interface SecureApiKeyInputProps {
  service: 'openrouter' | 'elevenlabs';
  label: string;
  placeholder: string;
  onKeyStored: (success: boolean) => void;
  className?: string;
}

export const SecureApiKeyInput: React.FC<SecureApiKeyInputProps> = ({
  service,
  label,
  placeholder,
  onKeyStored,
  className = ''
}) => {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  // Get current key status
  const keyStatus = secureKeyManager.getKeyStatus(service);

  const validateAndStoreKey = useCallback(async () => {
    if (!key.trim()) {
      setValidationResult({
        isValid: false,
        message: 'Please enter an API key'
      });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      // Store the key
      const success = secureKeyManager.storeKey(service, key.trim(), 24); // 24 hour expiry
      
      if (success) {
        setValidationResult({
          isValid: true,
          message: 'API key stored securely'
        });
        setKey(''); // Clear input
        onKeyStored(true);
      } else {
        setValidationResult({
          isValid: false,
          message: 'Invalid API key format'
        });
        onKeyStored(false);
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        message: error instanceof Error ? error.message : 'Failed to store API key'
      });
      onKeyStored(false);
    } finally {
      setIsValidating(false);
    }
  }, [key, service, onKeyStored]);

  const removeKey = useCallback(() => {
    secureKeyManager.removeKey(service);
    setValidationResult(null);
    onKeyStored(false);
  }, [service, onKeyStored]);

  const getKeyFormatHint = () => {
    switch (service) {
      case 'openrouter':
        return 'Format: sk-or-v1-[64 hex characters]';
      case 'elevenlabs':
        return 'Format: xi_[32 characters] or sk_[32-64 hex characters]';
      default:
        return '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Shield size={20} className="text-blue-400" />
        <label className="text-sm font-medium text-gray-200">
          {label}
        </label>
      </div>

      {keyStatus.hasKey ? (
        // Show existing key status
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-sm text-green-300">
                API key configured: {keyStatus.maskedKey}
              </span>
            </div>
            <button
              onClick={removeKey}
              className="text-xs text-red-400 hover:text-red-300 underline"
            >
              Remove
            </button>
          </div>
          {keyStatus.expiresAt && (
            <p className="text-xs text-gray-400 mt-1">
              Expires: {new Date(keyStatus.expiresAt).toLocaleString()}
            </p>
          )}
        </div>
      ) : (
        // Show input for new key
        <div className="space-y-3">
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 pr-12 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              disabled={isValidating}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
            >
              {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="text-xs text-slate-400">
            {getKeyFormatHint()}
          </div>

          <button
            onClick={validateAndStoreKey}
            disabled={isValidating || !key.trim()}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isValidating ? 'Validating...' : 'Store API Key Securely'}
          </button>

          {validationResult && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              validationResult.isValid 
                ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                : 'bg-red-500/10 border border-red-500/30 text-red-300'
            }`}>
              {validationResult.isValid ? (
                <CheckCircle size={16} />
              ) : (
                <AlertTriangle size={16} />
              )}
              <span className="text-sm">{validationResult.message}</span>
            </div>
          )}
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Shield size={16} className="text-blue-400 mt-0.5" />
          <div className="text-xs text-blue-300">
            <p className="font-medium mb-1">Security Notice:</p>
            <ul className="space-y-1 text-blue-200">
              <li>• Keys are encrypted before storage</li>
              <li>• Keys expire after 24 hours</li>
              <li>• Keys are stored locally only</li>
              <li>• Never share your API keys</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};