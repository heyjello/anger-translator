/**
 * AI Status Indicator Component
 * 
 * Shows the current AI service status and allows users to configure or toggle AI.
 */

import React, { useState } from 'react';
import { Bot, Settings, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { OpenRouterSetup } from './OpenRouterSetup';

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
  className?: string;
}

export const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({
  isAIAvailable,
  usedAI,
  aiModel,
  serviceStatus,
  onRefreshStatus,
  onToggleAI,
  className = ''
}) => {
  const [showSetup, setShowSetup] = useState(false);

  const getStatusColor = () => {
    if (serviceStatus.usingAI && serviceStatus.aiAvailable) return 'text-green-600';
    if (serviceStatus.aiAvailable) return 'text-blue-600';
    return 'text-gray-500';
  };

  const getStatusIcon = () => {
    if (serviceStatus.usingAI && serviceStatus.aiAvailable) {
      return <CheckCircle size={16} className="text-green-600" />;
    }
    if (serviceStatus.aiAvailable) {
      return <Bot size={16} className="text-blue-600" />;
    }
    return <AlertCircle size={16} className="text-gray-500" />;
  };

  const getStatusText = () => {
    if (serviceStatus.usingAI && serviceStatus.aiAvailable) {
      return `AI Active (${serviceStatus.model})`;
    }
    if (serviceStatus.aiAvailable) {
      return 'AI Available (Mock Mode)';
    }
    return 'AI Not Configured';
  };

  return (
    <>
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Status Display */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {/* AI Toggle (if available) */}
        {isAIAvailable && (
          <button
            onClick={() => onToggleAI(!serviceStatus.usingAI)}
            className={`px-3 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
              serviceStatus.usingAI
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            title={serviceStatus.usingAI ? 'Switch to Mock Mode' : 'Switch to AI Mode'}
          >
            {serviceStatus.usingAI ? (
              <span className="flex items-center gap-1">
                <Zap size={14} />
                AI On
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Bot size={14} />
                AI Off
              </span>
            )}
          </button>
        )}

        {/* Setup Button */}
        <button
          onClick={() => setShowSetup(true)}
          className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300"
          title="Configure AI Settings"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Last Translation Info */}
      {usedAI && aiModel && (
        <div className="mt-2 text-xs text-white/80 flex items-center gap-1">
          <Zap size={12} />
          Last translation used AI: {aiModel}
        </div>
      )}

      {/* Setup Modal */}
      <OpenRouterSetup
        isOpen={showSetup}
        onClose={() => setShowSetup(false)}
        onConfigured={() => {
          onRefreshStatus();
          setShowSetup(false);
        }}
      />
    </>
  );
};