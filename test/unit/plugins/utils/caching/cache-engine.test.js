import { jest, describe, beforeEach, afterEach, test, expect } from '@jest/globals'

const mockLoggerInfo = jest.fn()
const mockLoggerError = jest.fn()

jest.mock('../../../../../src/utils/logger.js', () => ({
  createLogger: () => ({
    info: mockLoggerInfo,
    error: mockLoggerError
  })
}))

jest.mock('ioredis', () => {
  const mockOn = jest.fn().mockReturnThis()
  const mockRedis = jest.fn().mockReturnValue({ on: mockOn })
  mockRedis.Cluster = jest.fn().mockReturnValue({ on: mockOn })
  return mockRedis
})

import { Engine as CatboxRedis } from '@hapi/catbox-redis'
import { Engine as CatboxMemory } from '@hapi/catbox-memory'
import { getCacheEngine } from '../../../../../src/utils/caching/cache-engine.js'
import { config } from '../../../../../src/config/config.js'

describe('#getCacheEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('When Redis cache engine has been requested', () => {
    let result
    
    beforeEach(() => {
      result = getCacheEngine('redis')
    })

    test('Should return a Redis cache instance', () => {
      expect(result).toBeInstanceOf(CatboxRedis)
    })
  })

  describe('When In memory cache engine has been requested', () => {
    let result
    
    beforeEach(() => {
      result = getCacheEngine()
    })

    test('Should return a Memory cache instance', () => {
      expect(result).toBeInstanceOf(CatboxMemory)
    })
  })

  describe('When In memory cache engine has been requested in Production', () => {
    let result
    let originalGetFn
    
    beforeEach(() => {

      originalGetFn = config.get

      config.get = jest.fn(key => {
        if (key === 'isProduction') return true
        if (key === 'redis') return { host: 'localhost' }
        return null
      })
      
      result = getCacheEngine()
    })

    afterEach(() => {
      config.get = originalGetFn
    })

    test('Should return a Memory cache instance', () => {
      expect(result).toBeInstanceOf(CatboxMemory)
    })
  })
})