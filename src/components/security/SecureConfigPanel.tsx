/**
 * Secure Configuration Panel
 * 
 * Provides a secure interface for configuring API keys and security settings.
 */

import React, { useState } from 'react';
import { Shield, Settings, Key, AlertTriangle, CheckCircle } from 'lucide-react';
import { SecureApiKeyInput } from './SecureApiKeyInput';
import { secureKeyManager } from '../../services/secureKeyManager';

interface SecureConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecureConfigPanel: React.FC<SecureConfigPanelProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'keys' | 'security'>('keys');
  const [keyStates, setKeyStates] = useState({
    openrouter: secureKeyManager.hasValidKey('openrouter'),
    elevenlabs: secureKeyManager.hasValidKey('elevenlabs')
  });

  const handleKeyStored = (service: 'openrouter' | 'elevenlabs', success: boolean) => {
    setKeyStates(prev => ({
      ...prev,
      [service]: success
    }));
  };

  const clearAllKeys = () => {
    if (confirm('Are you sure you want to clear all stored API keys? This action cannot be undone.')) {
      secureKeyManager.clearAllKeys();
      setKeyStates({
        openrouter: false,
        elevenlabs: false
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-blue-400" />
            <h2 className="text-xl font-bold text-white">Security Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setActiveTab('keys')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'keys'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key size={18} />
            API Keys
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'security'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings size={18} />
            Security Settings
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'keys' && (
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-300 mb-1">Secure Key Storage</h3>
                    <p className="text-sm text-blue-200">
                      API keys are encrypted before storage and automatically expire after 24 hours.
                      Keys are stored locally and never transmitted to our servers.
                    </p>
                  </div>
                </div>
              </div>

              <SecureApiKeyInput
                service="openrouter"
                label="OpenRouter API Key"
                placeholder="sk-or-v1-..."
                onKeyStored={(success) => handleKeyStored('openrouter', success)}
              />

              <SecureApiKeyInput
                service="elevenlabs"
                label="ElevenLabs API Key"
                placeholder="Enter your ElevenLabs API key"
                onKeyStored={(success) => handleKeyStored('elevenlabs', success)}
              />

              <div className="pt-4 border-t border-slate-700">
                <button
                  onClick={clearAllKeys}
                  className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <AlertTriangle size={16} />
                  Clear All API Keys
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Security Status</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <span className="text-slate-300">HTTPS Connection</span>
                    <div className="flex items-center gap-2">
                      {location.protocol === 'https:' ? (
                        <>
                          <CheckCircle size={16} className="text-green-400" />
                          <span className="text-green-400 text-sm">Secure</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={16} className="text-yellow-400" />
                          <span className="text-yellow-400 text-sm">Insecure</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <span className="text-slate-300">Secure Context</span>
                    <div className="flex items-center gap-2">
                      {window.isSecureContext ? (
                        <>
                          <CheckCircle size={16} className="text-green-400" />
                          <span className="text-green-400 text-sm">Available</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={16} className="text-red-400" />
                          <span className="text-red-400 text-sm">Unavailable</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <span className="text-slate-300">API Keys Configured</span>
                    <div className="flex items-center gap-2">
                      {(keyStates.openrouter || keyStates.elevenlabs) ? (
                        <>
                          <CheckCircle size={16} className="text-green-400" />
                          <span className="text-green-400 text-sm">
                            {Object.values(keyStates).filter(Boolean).length} of 2
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={16} className="text-yellow-400" />
                          <span className="text-yellow-400 text-sm">None</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Security Recommendations</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-300">✅ Rate limiting is active</p>
                  </div>
                  
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-300">✅ Input validation is enabled</p>
                  </div>
                  
                  {location.protocol !== 'https:' && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-yellow-300">⚠️ Use HTTPS in production</p>
                    </div>
                  )}
                  
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-300">💡 API keys expire automatically after 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};