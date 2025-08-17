// Test framework dependencies
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the config
vi.mock('../../../../src/config/index.js', () => ({
  config: {
    get: vi.fn(() => 1000 * 60 * 58) // mock TTL
  }
}))

// Import the mocked config
import { config } from '../../../../src/config/index.js'

// Thing under test
import { set } from '../../../../src/utils/caching/set.js'

describe('set', () => {
  const mockCache = {
    set: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call cache.set with key, value, and TTL from config', async () => {
    const key = 'myKey'
    const value = { foo: 'bar' }

    mockCache.set.mockResolvedValueOnce(undefined)

    await set(key, value, mockCache)

    expect(mockCache.set).toHaveBeenCalledWith(key, value, config.get('redisConfig.ttl'))
    expect(mockCache.set).toHaveBeenCalledTimes(1)
  })
})
