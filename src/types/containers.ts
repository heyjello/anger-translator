/**
 * Container-specific types and interfaces
 */

import { TranslationHistory } from '../components/HistoryPanel';
import { RageStyle } from './translation';

export interface AppState {
  showHistory: boolean;
  showStats: boolean;
  showShareModal: boolean;
  currentTranslation: {
    original: string;
    translated: string;
    style: RageStyle;
    rageLevel: number;
  } | null;
  translationHistory: TranslationHistory[];
}

export interface ContainerProps {
  className?: string;
}

export interface TranslationContainerState {
  inputText: string;
  selectedStyle: RageStyle;
  rageLevel: number;
  isCopied: boolean;
  inputError: string;
}

export interface NavigationState {
  showHistory: boolean;
  showStats: boolean;
}