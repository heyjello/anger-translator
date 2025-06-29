import React, { useState } from 'react';
import { Bot, Settings, CheckCircle, AlertCircle, Zap } from 'lucide-react';
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
}

export const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({
  isAIAvailable,
  usedAI,
  aiModel,
  serviceStatus,
  onRefreshStatus,
  onToggleAI
}) => {
  const [showSetup, setShowSetup] = useState(false);

  const getStatusInfo = () => {
    if (serviceStatus.usingAI && serviceStatus.aiAvailable) {
      return {
        icon: <CheckCircle size={16} className="text-green-400" />,
        text: `AI Active (${serviceStatus.model})`,
        subtext: 'Dynamic responses enabled',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        textColor: 'text-green-400'
      };
    }
    
    if (serviceStatus.aiAvailable && !serviceStatus.usingAI) {
      return {
        icon: <Bot size={16} className="text-blue-400" />,
        text: 'AI Available',
        subtext: 'Click to enable dynamic responses',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        textColor: 'text-blue-400'
      };
    }
    
    return {
      icon: <AlertCircle size={16} className="text-orange-400" />,
      text: 'AI Not Configured',
      subtext: 'Using mock responses - click to setup',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400'
    };
  };

  const status = getStatusInfo();

  const handleClick = () => {
    if (serviceStatus.aiAvailable && !serviceStatus.usingAI) {
      onToggleAI(true);
    } else if (!serviceStatus.aiAvailable) {
      setShowSetup(true);
    }
  };

  return (
    <>
      <div 
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl cursor-pointer transition-all duration-300 hover:scale-105 ${status.bgColor} ${status.borderColor}`}
        onClick={handleClick}
      >
        <div className="flex items-center gap-2">
          {status.icon}
          <div className="flex flex-col">
            <span className={`text-sm font-medium ${status.textColor}`}>
              {status.text}
            </span>
            <span className="text-xs text-gray-400">
              {status.subtext}
            </span>
          </div>
        </div>
        
        {serviceStatus.usingAI && (
          <div className="flex items-center gap-1">
            <Zap size={12} className="text-yellow-400 animate-pulse" />
            <span className="text-xs text-yellow-400 font-medium">LIVE</span>
          </div>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowSetup(true);
          }}
          className="p-1 hover:bg-white/10 rounded transition-colors"
          title="Configure AI Settings"
        >
          <Settings size={14} className="text-gray-400" />
        </button>
      </div>

      {showSetup && (
        <OpenRouterSetup
          isOpen={showSetup}
          onClose={() => setShowSetup(false)}
          onConfigured={() => {
            setShowSetup(false);
            onRefreshStatus();
          }}
        />
      )}
    </>
  );
};