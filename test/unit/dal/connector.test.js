import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest'
import { getServerInstance } from '../../../src/server.js'
import { dalConnector } from '../../../src/dal/connector.js'
import { exampleQuery } from '../../../src/dal/queries/example-query.js'

vi.mock('../../../src/server.js', () => ({
  getServerInstance: vi.fn().mockReturnValue({
    app: {
      cache: {
        get: vi.fn().mockResolvedValue(null)
      }
    }
  })
}))

vi.mock('../../../src/config/index.js', () => ({
  config: {
    get: vi.fn((key) => {
      if (key === 'dalConfig.endpoint') return 'http://test-dal-endpoint/graphql'
      return null
    })
  }
}))

vi.mock('../../../src/utils/logger.js', () => ({
  createLogger: vi.fn().mockReturnValue({
    error: vi.fn()
  })
}))

vi.mock('../../../src/services/DAL/token/get-token-service.js', () => ({
  getTokenService: vi.fn().mockResolvedValue('mocked-token')
}))

vi.mock('../../../src/utils/caching/token-cache.js', () => ({
  getTokenCache: vi.fn().mockReturnValue('mocked-cache')
}))

describe('DAL (data access layer) connector', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  const defaultSuccessData = { business: { sbi: 123456789, name: 'Test Business' } }
  const mockSuccessfulDalResponse = (data = defaultSuccessData) => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data, errors: null })
    })
  }

  describe('when the DAL returns a successful response', () => {
    test('should return data and status without errors', async () => {
      mockSuccessfulDalResponse()

      const result = await dalConnector(exampleQuery, { sbi: 123456789 })

      expect(result.data).toBeDefined()
      expect(result.data.business.name).toBe('Test Business')
      expect(result.errors).toBeNull()
      expect(result.statusCode).toBe(200)
      expect(global.fetch).toHaveBeenCalledTimes(1)
      const [, options] = global.fetch.mock.calls[0]
      expect(options.headers['x-forwarded-authorization']).toBeUndefined()
    })
  })

  describe('x-forwarded-authorization header', () => {
    describe('when defraIdToken is passed as an argument', () => {
      test('should send defraIdToken in x-forwarded-authorization', async () => {
        mockSuccessfulDalResponse()

        await dalConnector(exampleQuery, { sbi: 123456789 }, null, 'mocked-defra-id-token')

        expect(global.fetch).toHaveBeenCalledTimes(1)
        const [, options] = global.fetch.mock.calls[0]
        expect(options.headers['x-forwarded-authorization']).toBe('mocked-defra-id-token')
      })
    })

    describe('when defraIdToken is not passed and session has a token', () => {
      test('should send token from session cache in x-forwarded-authorization', async () => {
        getServerInstance().app.cache.get.mockResolvedValueOnce({ token: 'token-from-session' })
        mockSuccessfulDalResponse()

        await dalConnector(exampleQuery, { sbi: 123456789 }, 'session-id-123')

        expect(getServerInstance().app.cache.get).toHaveBeenCalledWith('session-id-123')
        expect(global.fetch).toHaveBeenCalledTimes(1)
        const [, options] = global.fetch.mock.calls[0]
        expect(options.headers['x-forwarded-authorization']).toBe('token-from-session')
      })
    })
  })

  describe('when the DAL returns a GraphQL error', () => {
    test('should return a formatted error response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({
          data: null,
          errors: [
            {
              message: 'SBI not found',
              extensions: {
                code: 'NOT_FOUND',
                response: {
                  status: 404
                }
              }
            }
          ]
        })
      })

      const result = await dalConnector(exampleQuery, { sbi: 123456789 })

      expect(result.data).toBeNull()
      expect(result.errors).toBeDefined()
      expect(result.errors[0].message).toBe('SBI not found')
      expect(result.errors[0].extensions.code).toBe('NOT_FOUND')
      expect(result.statusCode).toBe(404)
    })
  })

  describe('when a network error occurs', () => {
    test('returns a formatted error response', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const result = await dalConnector(exampleQuery, { sbi: 123456789 })

      expect(result.data).toBeNull()
      expect(result.statusCode).toBe(500)
      expect(result.errors[0].message).toBe('Network error')
    })
  })
})
