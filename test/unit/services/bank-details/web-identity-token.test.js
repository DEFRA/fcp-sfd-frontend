// Test framework dependencies
import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest'

// Things we need to mock
const mockConfigGet = vi.fn()

vi.mock('../../../../src/config/index.js', () => ({
  config: {
    get: mockConfigGet
  }
}))

const FIVE_MINUTES_MS = 5 * 60 * 1000
const THIRTY_SECONDS_MS = 30 * 1000

const configValues = (environment) => ({
  'server.cdpEnvironment': environment,
  'bankDetails.webIdentityToken.audience': 'fcp-sfd-bank-details',
  'bankDetails.webIdentityToken.durationSeconds': 300
})

const stsResponse = (token) => ({
  WebIdentityToken: token,
  Expiration: new Date(Date.now() + FIVE_MINUTES_MS)
})

describe('getWebIdentityToken', () => {
  let getWebIdentityToken
  let mockStsClient

  const useEnvironment = (environment) => {
    const values = configValues(environment)
    mockConfigGet.mockImplementation((key) => values[key])
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    // The token cache is module-level state, so re-import for a clean cache in each test
    vi.resetModules()
    ;({ getWebIdentityToken } = await import('../../../../src/services/bank-details/web-identity-token.js'))

    mockStsClient = { send: vi.fn().mockResolvedValue(stsResponse('mock-token-1')) }
    useEnvironment('test')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when running locally', () => {
    test('should return null without calling STS', async () => {
      useEnvironment('local')

      const token = await getWebIdentityToken(mockStsClient)

      expect(token).toBeNull()
      expect(mockStsClient.send).not.toHaveBeenCalled()
    })
  })

  describe('when no token has been cached', () => {
    test('should request a token from STS with the configured audience, duration and RS256', async () => {
      await getWebIdentityToken(mockStsClient)

      expect(mockStsClient.send).toHaveBeenCalledTimes(1)

      const [command] = mockStsClient.send.mock.calls[0]

      expect(command.input).toEqual({
        Audience: ['fcp-sfd-bank-details'],
        DurationSeconds: 300,
        SigningAlgorithm: 'RS256'
      })
    })

    test('should return the token from STS', async () => {
      const token = await getWebIdentityToken(mockStsClient)

      expect(token).toBe('mock-token-1')
    })
  })

  describe('when a valid token has been cached', () => {
    test('should reuse the cached token without calling STS again', async () => {
      await getWebIdentityToken(mockStsClient)
      const token = await getWebIdentityToken(mockStsClient)

      expect(token).toBe('mock-token-1')
      expect(mockStsClient.send).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the cached token is within the refresh margin of expiry', () => {
    test('should request a new token from STS', async () => {
      vi.useFakeTimers()

      await getWebIdentityToken(mockStsClient)

      mockStsClient.send.mockResolvedValue(stsResponse('mock-token-2'))
      vi.advanceTimersByTime(FIVE_MINUTES_MS - THIRTY_SECONDS_MS)

      const token = await getWebIdentityToken(mockStsClient)

      expect(token).toBe('mock-token-2')
      expect(mockStsClient.send).toHaveBeenCalledTimes(2)
    })
  })

  describe('when called concurrently with no cached token', () => {
    test('should share a single STS request between callers', async () => {
      const [first, second] = await Promise.all([
        getWebIdentityToken(mockStsClient),
        getWebIdentityToken(mockStsClient)
      ])

      expect(first).toBe('mock-token-1')
      expect(second).toBe('mock-token-1')
      expect(mockStsClient.send).toHaveBeenCalledTimes(1)
    })
  })

  describe('when STS fails', () => {
    test('should throw the STS error', async () => {
      mockStsClient.send.mockRejectedValue(new Error('AccessDenied'))

      await expect(getWebIdentityToken(mockStsClient)).rejects.toThrow('AccessDenied')
    })

    test('should retry STS on the next call rather than reuse the failure', async () => {
      mockStsClient.send.mockRejectedValueOnce(new Error('AccessDenied'))

      await expect(getWebIdentityToken(mockStsClient)).rejects.toThrow('AccessDenied')

      const token = await getWebIdentityToken(mockStsClient)

      expect(token).toBe('mock-token-1')
      expect(mockStsClient.send).toHaveBeenCalledTimes(2)
    })
  })
})
