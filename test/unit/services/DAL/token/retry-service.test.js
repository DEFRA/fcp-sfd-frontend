// Test framework dependencies
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Thing under test
import { retry } from '../../../../../src/services/DAL/token/retry-service.js'

// Test helpers
import { DAL_TOKEN } from '../../../../../src/constants/cache-keys.js'

// Things we need to mock
import { drop } from '../../../../../src/utils/caching/drop.js'
import { metrics } from '../../../../../src/utils/metrics.js'

// Mocks
vi.mock('../../../../../src/utils/caching/drop.js', () => ({
  drop: vi.fn()
}))

vi.mock('../../../../../src/utils/metrics.js', () => ({
  metrics: {
    counter: vi.fn(),
    millis: vi.fn()
  }
}))

const countCalls = (name) =>
  metrics.counter.mock.calls.filter(([metricName]) => metricName === name).length

describe('retry', () => {
  // The caching helpers are mocked, so this only needs to be an identifiable object
  // to assert it is threaded through to drop()
  const mockCache = {}

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runAllTimers()
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('should return the result if the function succeeds', async () => {
    const fn = vi.fn().mockResolvedValue('success')

    const resultPromise = retry(fn, mockCache)

    await vi.runAllTimersAsync()
    const result = await resultPromise

    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(1)
    expect(drop).not.toHaveBeenCalled()
    expect(metrics.counter).not.toHaveBeenCalled()
  })

  it('should drop DAL_TOKEN and retry function if it throws 401 error', async () => {
    const boomError = { isBoom: true, output: { statusCode: 401 } }
    const fn = vi.fn()
      .mockRejectedValueOnce(boomError)
      .mockResolvedValueOnce('success')

    const resultPromise = retry(fn, mockCache)

    await vi.runAllTimersAsync()
    const result = await resultPromise

    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should pass the cache to drop so the cached token can be removed', async () => {
    const boomError = { isBoom: true, output: { statusCode: 401 } }
    const fn = vi.fn()
      .mockRejectedValueOnce(boomError)
      .mockResolvedValueOnce('success')

    const resultPromise = retry(fn, mockCache)
    await vi.runAllTimersAsync()
    await resultPromise

    expect(drop).toHaveBeenCalledWith(DAL_TOKEN, mockCache)
  })

  it('emits dalTokenFetchError and dalTokenRetry once for a single recovered failure', async () => {
    const boomError = { isBoom: true, output: { statusCode: 401 } }
    const fn = vi.fn()
      .mockRejectedValueOnce(boomError)
      .mockResolvedValueOnce('success')

    const resultPromise = retry(fn, mockCache)
    await vi.runAllTimersAsync()
    await resultPromise

    expect(countCalls('dalTokenFetchError')).toBe(1)
    expect(countCalls('dalTokenRetry')).toBe(1)
    expect(metrics.counter).toHaveBeenCalledWith('dalTokenFetchError', 1)
    expect(metrics.counter).toHaveBeenCalledWith('dalTokenRetry', 1)
  })

  it('emits a fetch error per attempt and a retry per re-attempt before throwing', async () => {
    const error = new Error('persistent failure')
    // retry(fn, cache, 2) = 1 initial attempt + 2 retries = 3 failures, 2 retries
    const fn = vi.fn()
      .mockRejectedValueOnce(error)
      .mockRejectedValueOnce(error)
      .mockRejectedValueOnce(error)

    const resultPromise = retry(fn, mockCache, 2)
    const assertion = expect(resultPromise).rejects.toThrow('persistent failure')
    await vi.runAllTimersAsync()
    await assertion

    expect(fn).toHaveBeenCalledTimes(3)
    expect(countCalls('dalTokenFetchError')).toBe(3)
    expect(countCalls('dalTokenRetry')).toBe(2)
  })

  it('does not drop the token for non-401 errors', async () => {
    const error = new Error('network failure')
    const fn = vi.fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce('success')

    const resultPromise = retry(fn, mockCache)
    await vi.runAllTimersAsync()
    await resultPromise

    expect(drop).not.toHaveBeenCalled()
  })
})
