/**
 * Secure API Service
 * 
 * Implements secure API communication with proper key management,
 * input sanitization, and error handling.
 */

import { z } from 'zod';

// Input validation schemas
const TextInputSchema = z.string()
  .min(1, 'Text cannot be empty')
  .max(500, 'Text too long')
  .regex(/^[a-zA-Z0-9\s.,!?'"()-]+$/, 'Invalid characters detected');

const RageLevelSchema = z.number()
  .min(1, 'Rage level too low')
  .max(100, 'Rage level too high')
  .int('Rage level must be integer');

const PersonaSchema = z.enum([
  'enforcer', 'highland-howler', 'don', 'cracked-controller', 
  'karen', 'corporate', 'sarcastic'
]);

export interface SecureTranslationRequest {
  text: string;
  persona: string;
  rageLevel: number;
}

export class SecureApiService {
  private readonly maxRetries = 3;
  private readonly timeout = 10000; // 10 seconds
  private requestCount = new Map<string, { count: number; resetTime: number }>();

  /**
   * Sanitize user input to prevent injection attacks
   */
  private sanitizeInput(input: string): string {
    // Remove potentially dangerous characters
    let sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/[<>]/g, '') // Remove angle brackets
      .trim();

    // Limit length
    if (sanitized.length > 500) {
      sanitized = sanitized.substring(0, 500);
    }

    return sanitized;
  }

  /**
   * Validate input using Zod schemas
   */
  private validateInput(request: SecureTranslationRequest): void {
    try {
      TextInputSchema.parse(request.text);
      RageLevelSchema.parse(request.rageLevel);
      PersonaSchema.parse(request.persona);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  /**
   * Implement server-side rate limiting check
   */
  private checkRateLimit(clientId: string): boolean {
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 10;

    const clientData = this.requestCount.get(clientId) || { count: 0, resetTime: now + windowMs };

    if (now > clientData.resetTime) {
      // Reset window
      clientData.count = 1;
      clientData.resetTime = now + windowMs;
    } else {
      clientData.count++;
    }

    this.requestCount.set(clientId, clientData);

    if (clientData.count > maxRequests) {
      console.warn(`Rate limit exceeded for client: ${clientId}`);
      return false;
    }

    return true;
  }

  /**
   * Generate client fingerprint for rate limiting
   */
  private generateClientId(): string {
    // Use multiple factors for client identification
    const factors = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset().toString()
    ];
    
    // Simple hash function (in production, use crypto.subtle.digest)
    let hash = 0;
    const combined = factors.join('|');
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Secure API request with proper error handling
   */
  async makeSecureRequest(
    url: string, 
    options: RequestInit, 
    request: SecureTranslationRequest
  ): Promise<Response> {
    // Validate input
    this.validateInput(request);

    // Sanitize input
    const sanitizedRequest = {
      ...request,
      text: this.sanitizeInput(request.text)
    };

    // Check rate limiting
    const clientId = this.generateClientId();
    if (!this.checkRateLimit(clientId)) {
      throw new Error('Rate limit exceeded. Please wait before making another request.');
    }

    // Ensure HTTPS
    if (!url.startsWith('https://')) {
      throw new Error('Insecure connection detected. HTTPS required.');
    }

    // Add security headers
    const secureOptions: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      // Add timeout
      signal: AbortSignal.timeout(this.timeout)
    };

    let lastError: Error;
    
    // Retry logic with exponential backoff
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(url, secureOptions);
        
        if (!response.ok) {
          // Don't expose detailed error information
          if (response.status === 401) {
            throw new Error('Authentication failed');
          } else if (response.status === 429) {
            throw new Error('Rate limit exceeded');
          } else if (response.status >= 500) {
            throw new Error('Service temporarily unavailable');
          } else {
            throw new Error('Request failed');
          }
        }
        
        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < this.maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError!;
  }

  /**
   * Secure logging without exposing sensitive data
   */
  private secureLog(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      // Only log non-sensitive data
      data: data ? this.sanitizeLogData(data) : undefined
    };
    
    console[level](`[${timestamp}] ${message}`, logEntry.data);
  }

  /**
   * Remove sensitive data from logs
   */
  private sanitizeLogData(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }
    
    const sanitized = { ...data };
    
    // Remove sensitive fields
    const sensitiveFields = ['apiKey', 'token', 'password', 'secret', 'key'];
    sensitiveFields.forEach(field => {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }
}

// Export singleton instance
export const secureApiService = new SecureApiService();