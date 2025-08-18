// Test framework dependencies
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Import the mocked config
import { config } from '../../../../src/config/index.js'

// Thing under test
import { set } from '../../../../src/utils/caching/set.js'

// Mock the config
vi.mock('../../../../src/config/index.js', () => ({
  config: {
    get: vi.fn(() => 1000 * 60 * 58) // mock TTL
  }
}))

describe('set', () => {
  const mockCache = {
    set: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call cache.set with key, value, and expiresAt', async () => {
    const key = 'myKey'
    const value = { foo: 'bar' }
    const expiresAt = Date.now() + 1000 * 60 * 10 // 10 mins in future

    mockCache.set.mockResolvedValueOnce(undefined)

    await set(key, value, expiresAt, mockCache)

    expect(mockCache.set).toHaveBeenCalledWith(key, value, expiresAt)
    expect(mockCache.set).toHaveBeenCalledTimes(1)
  })
})
