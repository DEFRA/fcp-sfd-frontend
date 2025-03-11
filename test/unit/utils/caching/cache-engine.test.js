import { jest, describe, beforeEach, afterEach, test, expect, afterAll } from '@jest/globals'

const mockLoggerInfo = jest.fn()
const mockLoggerError = jest.fn()

const mockRedisOn = jest.fn().mockReturnThis()
const mockRedisQuit = jest.fn().mockResolvedValue()

const mockRedisInstance = {
  on: mockRedisOn,
  quit: mockRedisQuit
}

const Redis = jest.fn().mockReturnValue(mockRedisInstance)

Redis.Cluster = jest.fn().mockReturnValue(mockRedisInstance)

jest.unstable_mockModule('../../../../src/utils/logger.js', () => ({
  createLogger: () => ({
    info: mockLoggerInfo,
    error: mockLoggerError,
    flush: jest.fn().mockResolvedValue()
  })
}))

jest.unstable_mockModule('ioredis', () => ({
  default: Redis
}))

const mockCatboxRedisInstance = { start: jest.fn(), stop: jest.fn() }
const mockCatboxMemoryInstance = { start: jest.fn(), stop: jest.fn() }

jest.unstable_mockModule('@hapi/catbox-redis', () => ({
  Engine: jest.fn().mockImplementation(() => mockCatboxRedisInstance)
}))

jest.unstable_mockModule('@hapi/catbox-memory', () => ({
  Engine: jest.fn().mockImplementation(() => mockCatboxMemoryInstance)
}))

jest.unstable_mockModule('../../../../src/utils/caching/redis-client.js', () => ({
  buildRedisClient: jest.fn().mockReturnValue(mockRedisInstance)
}))

let originalConfigGet

jest.unstable_mockModule('../../../../src/config/config.js', () => {
  const mockConfig = {
    get: jest.fn(key => {
      if (key === 'redis') return { host: 'localhost', port: 6379 }
      if (key === 'isProduction') return false
      return null
    }),
    set: jest.fn()
  }
  
  originalConfigGet = mockConfig.get
  
  return { config: mockConfig }
})

let getCacheEngine, config

const setup = async () => {
  const cacheEngineModule = await import('../../../../src/utils/caching/cache-engine.js')
  const configModule = await import('../../../../src/config/config.js')
  
  getCacheEngine = cacheEngineModule.getCacheEngine
  config = configModule.config
}

beforeAll(async () => {
  await setup()
})

describe('#getCacheEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('When Redis cache engine has been requested', () => {
    test('Should return a Redis cache instance', () => {
      const result = getCacheEngine('redis')
      expect(mockLoggerInfo).toHaveBeenCalledWith('Using Redis session cache')
      expect(result).toBe(mockCatboxRedisInstance)
    })
  })

  describe('When In memory cache engine has been requested', () => {
    test('Should return a Memory cache instance', () => {
      const result = getCacheEngine()
      expect(mockLoggerInfo).toHaveBeenCalledWith('Using Catbox Memory session cache')
      expect(result).toBe(mockCatboxMemoryInstance)
    })
  })

  describe('When In memory cache engine has been requested in Production', () => {
    beforeEach(() => {
      config.get = jest.fn(key => {
        if (key === 'isProduction') return true
        if (key === 'redis') return { host: 'localhost', port: 6379 }
        return null
      })
    })

    afterEach(() => {
      config.get = originalConfigGet
    })

    test('Should return a Memory cache instance and log a warning', () => {
      const result = getCacheEngine()
      expect(mockLoggerError).toHaveBeenCalledWith(
        'Catbox Memory is for local development only, it should not be used in production!'
      )
      expect(mockLoggerInfo).toHaveBeenCalledWith('Using Catbox Memory session cache')
      expect(result).toBe(mockCatboxMemoryInstance)
    })
  })
})