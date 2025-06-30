/**
 * Security Headers Component
 * 
 * Implements Content Security Policy and other security headers
 * through meta tags and runtime checks.
 */

import React, { useEffect } from 'react';

export const SecurityHeaders: React.FC = () => {
  useEffect(() => {
    // Check if running over HTTPS in production
    if (import.meta.env.PROD && location.protocol !== 'https:') {
      console.error('🔒 Security Warning: Application should be served over HTTPS in production');
      
      // Optionally redirect to HTTPS
      if (import.meta.env.VITE_FORCE_HTTPS === 'true') {
        location.replace(`https:${location.href.substring(location.protocol.length)}`);
      }
    }

    // Check for secure context
    if (!window.isSecureContext) {
      console.warn('⚠️ Security Warning: Not running in secure context');
    }

    // Disable right-click in production (optional)
    if (import.meta.env.PROD && import.meta.env.VITE_DISABLE_RIGHT_CLICK === 'true') {
      const handleContextMenu = (e: MouseEvent) => e.preventDefault();
      document.addEventListener('contextmenu', handleContextMenu);
      
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, []);

  return (
    <>
      {/* Content Security Policy */}
      <meta 
        httpEquiv="Content-Security-Policy" 
        content={`
          default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval';
          style-src 'self' 'unsafe-inline';
          img-src 'self' data: https:;
          font-src 'self' data:;
          connect-src 'self' https://api.elevenlabs.io https://openrouter.ai;
          media-src 'self' blob:;
          object-src 'none';
          base-uri 'self';
          form-action 'self';
          frame-ancestors 'none';
          upgrade-insecure-requests;
        `.replace(/\s+/g, ' ').trim()
      } 
      />
      
      {/* Additional Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
    </>
  );
};