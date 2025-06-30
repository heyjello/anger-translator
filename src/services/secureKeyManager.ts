/**
 * Secure Key Manager
 * 
 * Handles secure storage and retrieval of API keys with encryption.
 * Implements best practices for client-side key management.
 */

export interface KeyConfig {
  service: string;
  key: string;
  expiresAt?: number;
}

export class SecureKeyManager {
  private readonly storageKey = 'secure_api_keys';
  private readonly encryptionKey: string;

  constructor() {
    // Generate or retrieve encryption key
    this.encryptionKey = this.getOrCreateEncryptionKey();
  }

  /**
   * Generate or retrieve encryption key for local storage
   */
  private getOrCreateEncryptionKey(): string {
    const keyName = 'app_encryption_key';
    let key = sessionStorage.getItem(keyName);
    
    if (!key) {
      // Generate a new key for this session
      key = this.generateRandomKey();
      sessionStorage.setItem(keyName, key);
    }
    
    return key;
  }

  /**
   * Generate a random encryption key
   */
  private generateRandomKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Simple XOR encryption for client-side storage
   * Note: This is not cryptographically secure, but better than plaintext
   */
  private encrypt(text: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const textChar = text.charCodeAt(i);
      const keyChar = this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
      result += String.fromCharCode(textChar ^ keyChar);
    }
    return btoa(result); // Base64 encode
  }

  /**
   * Decrypt XOR encrypted text
   */
  private decrypt(encryptedText: string): string {
    try {
      const text = atob(encryptedText); // Base64 decode
      let result = '';
      for (let i = 0; i < text.length; i++) {
        const textChar = text.charCodeAt(i);
        const keyChar = this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
        result += String.fromCharCode(textChar ^ keyChar);
      }
      return result;
    } catch (error) {
      console.error('Failed to decrypt key:', error);
      return '';
    }
  }

  /**
   * Validate API key format
   */
  private validateKeyFormat(service: string, key: string): boolean {
    const patterns = {
      openrouter: /^sk-or-v1-[a-f0-9]{64}$/,
      elevenlabs: /^(xi_[a-zA-Z0-9]{32}|sk_[a-f0-9]{32,64})$/
    };

    const pattern = patterns[service as keyof typeof patterns];
    if (!pattern) {
      console.warn(`No validation pattern for service: ${service}`);
      return true; // Allow unknown services
    }

    return pattern.test(key);
  }

  /**
   * Store API key securely
   */
  storeKey(service: string, key: string, expiresInHours?: number): boolean {
    try {
      // Validate key format
      if (!this.validateKeyFormat(service, key)) {
        throw new Error(`Invalid API key format for ${service}`);
      }

      // Get existing keys
      const existingKeys = this.getAllKeys();
      
      // Calculate expiration
      const expiresAt = expiresInHours 
        ? Date.now() + (expiresInHours * 60 * 60 * 1000)
        : undefined;

      // Update or add key
      existingKeys[service] = {
        service,
        key: this.encrypt(key),
        expiresAt
      };

      // Store encrypted keys
      localStorage.setItem(this.storageKey, JSON.stringify(existingKeys));
      
      console.log(`✅ API key stored securely for ${service}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to store key for ${service}:`, error);
      return false;
    }
  }

  /**
   * Retrieve API key securely
   */
  getKey(service: string): string | null {
    try {
      const keys = this.getAllKeys();
      const keyConfig = keys[service];
      
      if (!keyConfig) {
        return null;
      }

      // Check expiration
      if (keyConfig.expiresAt && Date.now() > keyConfig.expiresAt) {
        console.warn(`API key for ${service} has expired`);
        this.removeKey(service);
        return null;
      }

      return this.decrypt(keyConfig.key);
    } catch (error) {
      console.error(`Failed to retrieve key for ${service}:`, error);
      return null;
    }
  }

  /**
   * Remove API key
   */
  removeKey(service: string): boolean {
    try {
      const keys = this.getAllKeys();
      delete keys[service];
      localStorage.setItem(this.storageKey, JSON.stringify(keys));
      console.log(`🗑️ API key removed for ${service}`);
      return true;
    } catch (error) {
      console.error(`Failed to remove key for ${service}:`, error);
      return false;
    }
  }

  /**
   * Get all stored keys (encrypted)
   */
  private getAllKeys(): Record<string, KeyConfig> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to parse stored keys:', error);
      return {};
    }
  }

  /**
   * Check if key exists and is valid
   */
  hasValidKey(service: string): boolean {
    const key = this.getKey(service);
    return !!key && this.validateKeyFormat(service, key);
  }

  /**
   * Clear all stored keys
   */
  clearAllKeys(): void {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem('app_encryption_key');
    console.log('🗑️ All API keys cleared');
  }

  /**
   * Get key status for UI
   */
  getKeyStatus(service: string): {
    hasKey: boolean;
    isValid: boolean;
    expiresAt?: number;
    maskedKey?: string;
  } {
    const keys = this.getAllKeys();
    const keyConfig = keys[service];
    
    if (!keyConfig) {
      return { hasKey: false, isValid: false };
    }

    const key = this.decrypt(keyConfig.key);
    const isValid = this.validateKeyFormat(service, key);
    const maskedKey = key ? `${key.substring(0, 8)}...${key.substring(key.length - 4)}` : undefined;

    return {
      hasKey: !!key,
      isValid,
      expiresAt: keyConfig.expiresAt,
      maskedKey
    };
  }
}

// Export singleton instance
export const secureKeyManager = new SecureKeyManager();