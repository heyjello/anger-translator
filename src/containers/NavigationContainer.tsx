import React, { useState } from 'react';
import { NavigationHeader } from '../components';

interface NavigationContainerProps {
  historyCount: number;
  onToggleHistory: () => void;
  onToggleStats: () => void;
}

export const NavigationContainer: React.FC<NavigationContainerProps> = ({
  historyCount,
  onToggleHistory,
  onToggleStats
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const handleToggleHistory = () => {
    setShowHistory(!showHistory);
    onToggleHistory();
  };

  const handleToggleStats = () => {
    setShowStats(!showStats);
    onToggleStats();
  };

  return (
    <NavigationHeader
      historyCount={historyCount}
      showHistory={showHistory}
      showStats={showStats}
      onToggleHistory={handleToggleHistory}
      onToggleStats={handleToggleStats}
    />
  );
};