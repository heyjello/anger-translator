/**
 * Security Utilities
 * 
 * Collection of security-related utility functions.
 */

/**
 * Generate a cryptographically secure random string
 */
export function generateSecureRandomString(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate URL to ensure it's safe
 */
export function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    
    // Only allow HTTPS in production
    if (import.meta.env.PROD && parsed.protocol !== 'https:') {
      return false;
    }
    
    // Allow HTTP only in development
    if (!import.meta.env.PROD && !['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    
    // Block dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    if (dangerousProtocols.includes(parsed.protocol)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Check if running in secure context
 */
export function isSecureContext(): boolean {
  return window.isSecureContext;
}

/**
 * Generate Content Security Policy nonce
 */
export function generateCSPNonce(): string {
  return generateSecureRandomString(16);
}

/**
 * Validate and sanitize user input
 */
export function sanitizeUserInput(input: string, maxLength: number = 500): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  // Remove potentially dangerous content
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Check for suspicious patterns in user input
 */
export function detectSuspiciousInput(input: string): boolean {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /document\./i,
    /window\./i,
    /alert\s*\(/i,
    /confirm\s*\(/i,
    /prompt\s*\(/i
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(input));
}

/**
 * Rate limiting helper
 */
export class ClientRateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number = 10,
    private windowMs: number = 60000
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }
  
  getTimeUntilReset(identifier: string): number {
    const requests = this.requests.get(identifier) || [];
    if (requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...requests);
    return Math.max(0, this.windowMs - (Date.now() - oldestRequest));
  }
}

/**
 * Secure session storage wrapper
 */
export class SecureSessionStorage {
  private static encrypt(data: string, key: string): string {
    // Simple XOR encryption (not cryptographically secure, but better than plaintext)
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  }
  
  private static decrypt(encryptedData: string, key: string): string {
    try {
      const data = atob(encryptedData);
      let result = '';
      for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return result;
    } catch {
      return '';
    }
  }
  
  static setItem(key: string, value: string, encryptionKey?: string): void {
    try {
      const dataToStore = encryptionKey ? this.encrypt(value, encryptionKey) : value;
      sessionStorage.setItem(key, dataToStore);
    } catch (error) {
      console.error('Failed to store secure session data:', error);
    }
  }
  
  static getItem(key: string, encryptionKey?: string): string | null {
    try {
      const stored = sessionStorage.getItem(key);
      if (!stored) return null;
      
      return encryptionKey ? this.decrypt(stored, encryptionKey) : stored;
    } catch (error) {
      console.error('Failed to retrieve secure session data:', error);
      return null;
    }
  }
  
  static removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }
}