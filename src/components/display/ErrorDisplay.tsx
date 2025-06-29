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
        container: 'text-red-700 bg-red-50 border-red-200',
        icon: 'text-red-600'
      };
    case 'warning':
      return {
        container: 'text-orange-700 bg-orange-50 border-orange-200',
        icon: 'text-orange-600'
      };
    case 'info':
      return {
        container: 'text-blue-700 bg-blue-50 border-blue-200',
        icon: 'text-blue-600'
      };
    default:
      return {
        container: 'text-gray-700 bg-gray-50 border-gray-200',
        icon: 'text-gray-600'
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
    <div className={`flex items-center gap-3 border rounded-lg p-4 animate-slide-in ${styles.container} ${className}`}>
      <div className={styles.icon}>
        {displayIcon}
      </div>
      <div className="flex-1">
        <div className="font-semibold capitalize">{type}</div>
        <div className="text-sm">{message}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-auto hover:opacity-70 font-medium text-sm transition-opacity"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};