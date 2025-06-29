/**
 * ParticleEffect Component
 * 
 * CSS-only particle animation that triggers on translation
 */

import React, { useEffect, useState } from 'react';

interface ParticleEffectProps {
  isActive: boolean;
  onComplete?: () => void;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  isActive,
  onComplete
}) => {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowParticles(true);
      const timer = setTimeout(() => {
        setShowParticles(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!showParticles) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Fire particles */}
      <div className="particle particle-1 animate-particle-float-1">🔥</div>
      <div className="particle particle-2 animate-particle-float-2">💥</div>
      <div className="particle particle-3 animate-particle-float-3">⚡</div>
      <div className="particle particle-4 animate-particle-float-4">🔥</div>
      <div className="particle particle-5 animate-particle-float-5">💢</div>
      <div className="particle particle-6 animate-particle-float-6">⚡</div>
      <div className="particle particle-7 animate-particle-float-7">🔥</div>
      <div className="particle particle-8 animate-particle-float-8">💥</div>
      
      {/* Explosion effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="explosion-ring animate-explosion-ring"></div>
        <div className="explosion-ring-2 animate-explosion-ring-delayed"></div>
      </div>
    </div>
  );
};