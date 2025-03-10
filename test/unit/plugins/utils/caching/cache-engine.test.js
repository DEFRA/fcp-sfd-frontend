// test/unit/plugins/utils/caching/cache-engine.test.js
import { jest, describe, beforeEach, afterEach, test, expect } from '@jest/globals';

// Create mock functions we'll access directly
const mockLoggerInfo = jest.fn();
const mockLoggerError = jest.fn();

// Mock modules before importing anything
jest.mock('../../../../../src/utils/logger.js', () => ({
  createLogger: () => ({
    info: mockLoggerInfo,
    error: mockLoggerError
  })
}));

jest.mock('ioredis', () => {
  const mockOn = jest.fn().mockReturnThis();
  const mockRedis = jest.fn().mockReturnValue({ on: mockOn });
  mockRedis.Cluster = jest.fn().mockReturnValue({ on: mockOn });
  return mockRedis;
});

// Import modules after mocking
import { Engine as CatboxRedis } from '@hapi/catbox-redis';
import { Engine as CatboxMemory } from '@hapi/catbox-memory';
import { getCacheEngine } from '../../../../../src/utils/caching/cache-engine.js';
import { config } from '../../../../../src/config/config.js';

describe('#getCacheEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When Redis cache engine has been requested', () => {
    let result;
    
    beforeEach(() => {
      result = getCacheEngine('redis');
    });

    test('Should return a Redis cache instance', () => {
      expect(result).toBeInstanceOf(CatboxRedis);
    });
  });

  describe('When In memory cache engine has been requested', () => {
    let result;
    
    beforeEach(() => {
      result = getCacheEngine();
    });

    test('Should return a Memory cache instance', () => {
      expect(result).toBeInstanceOf(CatboxMemory);
    });
  });

  describe('When In memory cache engine has been requested in Production', () => {
    let result;
    let originalGetFn;
    
    beforeEach(() => {
      // Save original config.get
      originalGetFn = config.get;
      
      // Mock config.get to return true for 'isProduction'
      config.get = jest.fn(key => {
        if (key === 'isProduction') return true;
        if (key === 'redis') return { host: 'localhost' };
        return null;
      });
      
      result = getCacheEngine();
    });

    afterEach(() => {
      // Restore original config.get
      config.get = originalGetFn;
    });

    test('Should return a Memory cache instance', () => {
      expect(result).toBeInstanceOf(CatboxMemory);
    });
  });
});