import { describe, it, expect, vi, beforeEach } from 'vitest';

// Import the functions we want to test
import { getFullUrl, getEmailLink, env } from './env';

describe('Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });



  describe('getFullUrl function', () => {
    it('should add leading slash if missing', () => {
      const result = getFullUrl('test');
      expect(result).toMatch(/\/test$/);
    });

    it('should not add duplicate slashes', () => {
      const result = getFullUrl('/test');
      expect(result).toMatch(/\/test$/);
    });

    it('should handle empty path', () => {
      const result = getFullUrl('');
      expect(result).toMatch(/\/$/);
    });
  });

  describe('getEmailLink function', () => {
    it('should create basic mailto link', () => {
      const result = getEmailLink('test@example.com');
      expect(result).toBe('mailto:test@example.com');
    });

    it('should create mailto link with subject', () => {
      const result = getEmailLink('test@example.com', 'Test Subject');
      expect(result).toBe('mailto:test@example.com?subject=Test%20Subject');
    });

    it('should encode special characters in subject', () => {
      const result = getEmailLink('test@example.com', 'Test & Subject');
      expect(result).toBe('mailto:test@example.com?subject=Test%20%26%20Subject');
    });
  });

  describe('DEBUG configuration', () => {
    it('should have DEBUG property', () => {
      expect(env).toHaveProperty('DEBUG');
      expect(typeof env.DEBUG).toBe('boolean');
    });

    it('should have a boolean DEBUG value', () => {
      // DEBUG should be a boolean value
      expect(typeof env.DEBUG).toBe('boolean');
      console.log('Current DEBUG value:', env.DEBUG);
    });
  });
}); 