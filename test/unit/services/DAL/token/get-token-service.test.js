// Test framework dependencies
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Thing under test
import { getTokenService } from '../../../../../src/services/DAL/token/get-token-service.js'

// Mock dependencies
import { get, set } from '../../../../../src/utils/caching/index.js'
import { retry } from '../../../../../src/services/DAL/token/retry-service.js'
import { metrics } from '../../../../../src/utils/metrics.js'
import Wreck from '@hapi/wreck'
import { config } from '../../../../../src/config/index.js'

// Mock all imports
vi.mock('../../../../../src/utils/caching/index.js', () => ({
  get: vi.fn(),
  set: vi.fn()
}))

vi.mock('../../../../../src/services/DAL/token/retry-service.js', () => ({
  retry: vi.fn()
}))

vi.mock('@hapi/wreck', () => ({
  default: {
    post: vi.fn()
  }
}))

vi.mock('../../../../../src/config/index.js', () => ({
  config: {
    get: vi.fn()
  }
}))

vi.mock('../../../../../src/utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn() })
}))

vi.mock('../../../../../src/utils/metrics.js', () => ({
  metrics: {
    counter: vi.fn(),
    millis: vi.fn()
  }
}))

const tokenResponse = (overrides = {}) => ({
  payload: {
    token_type: 'Bearer',
    access_token: 'new-access-token',
    expires_in: 354,
    ...overrides
  }
})

describe('getTokenService', () => {
  const mockCache = {}

  beforeEach(() => {
    vi.clearAllMocks()
    config.get.mockReturnValue({
      clientId: 'fake-client',
      clientSecret: 'fake-secret',
      tokenEndpoint: 'https://dal.test/token'
    })
    // The real retry passes the cache through as its second argument
    retry.mockImplementation((fn) => fn())
  })

  describe('when a cached token exists', () => {
    beforeEach(() => {
      get.mockResolvedValueOnce('Bearer cached-token')
    })

    it('returns the cached token without calling Azure AD', async () => {
      const result = await getTokenService(mockCache)

      expect(get).toHaveBeenCalledWith('dal-token', mockCache)
      expect(result).toBe('Bearer cached-token')
      expect(Wreck.post).not.toHaveBeenCalled()
      expect(set).not.toHaveBeenCalled()
    })

    it('emits the dalTokenCacheHit counter', async () => {
      await getTokenService(mockCache)

      expect(metrics.counter).toHaveBeenCalledWith('dalTokenCacheHit', 1)
      expect(metrics.counter).not.toHaveBeenCalledWith('dalTokenCacheMiss', 1)
    })

    it('records the total time but not a fetch duration', async () => {
      await getTokenService(mockCache)

      expect(metrics.millis).toHaveBeenCalledWith('dalTokenTotalTime', expect.any(Number))
      expect(metrics.millis).not.toHaveBeenCalledWith(
        'dalTokenFetchTime',
        expect.any(Number),
        expect.anything()
      )
    })

    it('passes the cache to retry so a 401 can drop the cached token', async () => {
      await getTokenService(mockCache)

      expect(retry).toHaveBeenCalledWith(expect.any(Function), mockCache)
    })
  })

  describe('when retry backs off between attempts', () => {
    // Guards the core purpose of this instrumentation: dalTokenTotalTime must wrap the
    // whole retry loop, so the backoff waits are visible in the metric.
    // Fake timers make Date.now() advance deterministically with the setTimeout, so this
    // isn't sensitive to real clock/scheduler jitter like a real setTimeout(50) would be
    it('includes the time spent waiting in dalTokenTotalTime', async () => {
      vi.useFakeTimers()

      get.mockResolvedValue('******')
      retry.mockImplementation(async (fn) => {
        await new Promise((resolve) => setTimeout(resolve, 50))
        return fn()
      })

      const resultPromise = getTokenService(mockCache)
      await vi.advanceTimersByTimeAsync(50)
      await resultPromise

      const totalCall = metrics.millis.mock.calls.find(([name]) => name === 'dalTokenTotalTime')

      expect(totalCall).toBeDefined()
      expect(totalCall[1]).toBeGreaterThanOrEqual(50)

      vi.useRealTimers()
    })
  })

  describe('when no cached token exists', () => {
    beforeEach(() => {
      get.mockResolvedValueOnce(null)
    })

    it('fetches a new token and caches it', async () => {
      const response = tokenResponse()
      Wreck.post.mockResolvedValueOnce(response)

      const result = await getTokenService(mockCache)

      expect(Wreck.post).toHaveBeenCalledWith('https://dal.test/token', {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        payload: expect.stringContaining('client_id=fake-client'),
        json: true
      })

      expect(set).toHaveBeenCalledWith(
        'dal-token',
        'Bearer new-access-token',
        (response.payload.expires_in * 1000) - 60000,
        mockCache
      )

      expect(result).toBe('Bearer new-access-token')
    })

    it('emits the dalTokenCacheMiss counter', async () => {
      Wreck.post.mockResolvedValueOnce(tokenResponse())

      await getTokenService(mockCache)

      expect(metrics.counter).toHaveBeenCalledWith('dalTokenCacheMiss', 1)
      expect(metrics.counter).not.toHaveBeenCalledWith('dalTokenCacheHit', 1)
    })

    it('records the token fetch duration as a success', async () => {
      Wreck.post.mockResolvedValueOnce(tokenResponse())

      await getTokenService(mockCache)

      expect(metrics.millis).toHaveBeenCalledWith(
        'dalTokenFetchTime',
        expect.any(Number),
        { outcome: 'success' }
      )
    })
  })

  describe('when the token request fails', () => {
    beforeEach(() => {
      get.mockResolvedValueOnce(null)
      Wreck.post.mockRejectedValueOnce(new Error('dal error'))
    })

    it('propagates the original error rather than masking it', async () => {
      await expect(getTokenService(mockCache)).rejects.toThrow('dal error')

      expect(Wreck.post).toHaveBeenCalled()
      expect(set).not.toHaveBeenCalled()
    })

    it('records the fetch duration tagged as an error, and the total time', async () => {
      await expect(getTokenService(mockCache)).rejects.toThrow('dal error')

      expect(metrics.millis).toHaveBeenCalledWith(
        'dalTokenFetchTime',
        expect.any(Number),
        { outcome: 'error' }
      )
      expect(metrics.millis).toHaveBeenCalledWith('dalTokenTotalTime', expect.any(Number))
    })
  })
})
