/**
 * UI component types and interfaces
 */

export type ErrorType = 'error' | 'warning' | 'info';

export interface BaseComponentProps {
  className?: string;
  disabled?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}