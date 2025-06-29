/**
 * Core translation types and interfaces
 */

export type RageStyle = 'corporate' | 'gamer' | 'sarcastic';

export interface TranslationRequest {
  text: string;
  style: RageStyle;
  intensity: number;
}

export interface TranslationHistory {
  id: string;
  originalText: string;
  translatedText: string;
  style: string;
  rageLevel: number;
  timestamp: Date;
}

export interface TranslationStats {
  totalTranslations: number;
  averageRageLevel: number;
  favoriteStyle: {
    style: string;
    count: number;
  };
  maxRageLevel: number;
  styleBreakdown: Record<string, number>;
}