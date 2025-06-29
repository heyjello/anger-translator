/**
 * BackgroundAnimation Component
 * 
 * Self-contained animated background elements that provide visual appeal
 * without affecting the main application functionality.
 */

import React from 'react';

export const BackgroundAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-yellow-300 rounded-full blur-lg animate-bounce"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-400 rounded-full blur-md animate-ping"></div>
    </div>
  );
};