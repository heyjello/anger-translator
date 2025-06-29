/**
 * BackgroundAnimation Component
 * 
 * Self-contained animated background elements that provide visual appeal
 * without affecting the main application functionality.
 */

import React from 'react';

export const BackgroundAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-500 rounded-full blur-lg animate-bounce"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-500 rounded-full blur-md animate-ping"></div>
      <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-green-500 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/3 left-1/2 w-12 h-12 bg-yellow-500 rounded-full blur-md animate-bounce" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};