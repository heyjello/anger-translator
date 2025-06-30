/**
 * ParticleEffect Component
 * 
 * FIXED: Proper z-index and positioning to avoid overlaying input fields
 */

import React, { useEffect, useState } from 'react';

interface ParticleEffectProps {
  isActive: boolean;
  onComplete: () => void;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  isActive,
  onComplete
}) => {
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    console.log('🎆 Particle effect activated');

    // Create 8 particles with different animations
    const newParticles = Array.from({ length: 8 }, (_, index) => (
      <div
        key={`particle-${index}-${Date.now()}`}
        className={`particle particle-${index + 1} animate-particle-float-${index + 1} text-red-400 absolute pointer-events-none`}
        style={{
          fontSize: '2rem',
          zIndex: 35, // FIXED: Lower z-index than input fields (z-30)
          left: `${10 + index * 10}vw`,
          bottom: '0',
          filter: 'drop-shadow(0 0 10px currentColor)'
        }}
      >
        🔥
      </div>
    ));

    // Create explosion rings
    const explosionRings = [
      <div
        key={`ring-1-${Date.now()}`}
        className="explosion-ring animate-explosion-ring absolute pointer-events-none"
        style={{
          zIndex: 35, // FIXED: Lower z-index
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />,
      <div
        key={`ring-2-${Date.now()}`}
        className="explosion-ring-2 animate-explosion-ring-delayed absolute pointer-events-none"
        style={{
          zIndex: 35, // FIXED: Lower z-index
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
    ];

    setParticles([...newParticles, ...explosionRings]);

    // Clean up after animation completes
    const cleanup = setTimeout(() => {
      setParticles([]);
      onComplete();
      console.log('🎆 Particle effect completed');
    }, 2500);

    return () => {
      clearTimeout(cleanup);
      setParticles([]);
    };
  }, [isActive, onComplete]);

  if (!isActive || particles.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 35 }}>
      {particles}
    </div>
  );
};