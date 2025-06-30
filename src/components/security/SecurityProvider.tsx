/**
 * Security Provider Component
 * 
 * Provides security context and monitoring throughout the application.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SecurityHeaders } from './SecurityHeaders';
import { isSecureContext, ClientRateLimiter } from '../../utils/securityUtils';

interface SecurityContextType {
  isSecure: boolean;
  rateLimiter: ClientRateLimiter;
  reportSecurityIssue: (issue: string, details?: any) => void;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [isSecure, setIsSecure] = useState(false);
  const [rateLimiter] = useState(() => new ClientRateLimiter(10, 60000)); // 10 requests per minute

  useEffect(() => {
    // Check security context
    setIsSecure(isSecureContext());

    // Monitor for security issues
    const handleSecurityError = (event: SecurityPolicyViolationEvent) => {
      console.error('🔒 Security Policy Violation:', {
        directive: event.violatedDirective,
        blockedURI: event.blockedURI,
        lineNumber: event.lineNumber,
        sourceFile: event.sourceFile
      });
      
      // Report to monitoring service in production
      if (import.meta.env.PROD) {
        reportSecurityIssue('CSP Violation', {
          directive: event.violatedDirective,
          blockedURI: event.blockedURI
        });
      }
    };

    // Listen for CSP violations
    document.addEventListener('securitypolicyviolation', handleSecurityError);

    // Check for mixed content
    if (location.protocol === 'https:' && document.querySelector('script[src^="http:"], link[href^="http:"]')) {
      console.warn('⚠️ Mixed content detected - some resources loaded over HTTP');
    }

    return () => {
      document.removeEventListener('securitypolicyviolation', handleSecurityError);
    };
  }, []);

  const reportSecurityIssue = (issue: string, details?: any) => {
    const report = {
      timestamp: new Date().toISOString(),
      issue,
      details,
      userAgent: navigator.userAgent,
      url: location.href,
      isSecureContext: window.isSecureContext
    };

    console.error('🔒 Security Issue Reported:', report);

    // In production, send to monitoring service
    if (import.meta.env.PROD && import.meta.env.VITE_SECURITY_ENDPOINT) {
      fetch(import.meta.env.VITE_SECURITY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      }).catch(error => {
        console.error('Failed to report security issue:', error);
      });
    }
  };

  const contextValue: SecurityContextType = {
    isSecure,
    rateLimiter,
    reportSecurityIssue
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      <SecurityHeaders />
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};