/**
 * ErrorDisplay Component
 * 
 * Reusable component for displaying errors, warnings, and info messages
 * with consistent styling and behavior across the application.
 */

import React from 'react';
import { AlertCircle, Clock, Info, X } from 'lucide-react';
import { ErrorType } from '../../types/ui';

interface ErrorDisplayProps {
  type: ErrorType;
  message: string;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const getErrorStyles = (type: ErrorType) => {
  switch (type) {
    case 'error':
      return {
        container: 'text-red-400 bg-red-500/10 border-red-500/30',
        icon: 'text-red-400'
      };
    case 'warning':
      return {
        container: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
        icon: 'text-orange-400'
      };
    case 'info':
      return {
        container: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        icon: 'text-blue-400'
      };
    default:
      return {
        container: 'text-gray-400 bg-gray-500/10 border-gray-500/30',
        icon: 'text-gray-400'
      };
  }
};

const getDefaultIcon = (type: ErrorType) => {
  switch (type) {
    case 'error':
      return <AlertCircle size={20} />;
    case 'warning':
      return <Clock size={20} />;
    case 'info':
      return <Info size={20} />;
    default:
      return <AlertCircle size={20} />;
  }
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  type,
  message,
  onDismiss,
  icon,
  className = ''
}) => {
  const styles = getErrorStyles(type);
  const displayIcon = icon || getDefaultIcon(type);

  return (
    <div className={`flex items-center gap-3 border rounded-lg p-4 animate-slide-in backdrop-blur-sm ${styles.container} ${className}`}>
      <div className={styles.icon}>
        {displayIcon}
      </div>
      <div className="flex-1">
        <div className="font-semibold capitalize">{type}</div>
        <div className="text-sm opacity-90">{message}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-auto hover:opacity-70 font-medium text-sm transition-opacity p-1 hover:bg-white/10 rounded"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};