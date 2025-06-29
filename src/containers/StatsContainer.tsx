import React, { useState } from 'react';
import { StatsPanel } from '../components';
import { type TranslationHistory } from '../components/HistoryPanel';

interface StatsContainerProps {
  isVisible: boolean;
  history: TranslationHistory[];
}

export const StatsContainer: React.FC<StatsContainerProps> = ({
  isVisible,
  history
}) => {
  if (!isVisible) return null;

  return (
    <div className="mb-8 animate-fade-in">
      <StatsPanel history={history} />
    </div>
  );
};