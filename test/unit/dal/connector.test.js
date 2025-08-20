import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest'
import { dalConnector } from '../../../src/dal/connector.js'
import { exampleQuery } from '../../../src/dal/queries/example-query.js'

vi.mock('../../../src/config/index.js', () => ({
  config: {
    get: vi.fn((key) => {
      if (key === 'dalConfig.endpoint') return 'http://test-dal-endpoint/graphql'
      if (key === 'dalConfig.email') return 'mock-test-user@defra.gov.uk'
    })
  }
}))

vi.mock('../../../src/utils/logger.js', () => ({
  createLogger: vi.fn().mockReturnValue({
    error: vi.fn()
  })
}))

vi.mock('../../../src/services/DAL/token/get-token-service.js', () => ({
  getTokenService: vi.fn().mockResolvedValue('Bearer mock-token')
}))

describe('DAL (data access layer) connector', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  test('should handle GraphQL errors', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
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

    const result = await dalConnector(exampleQuery, { sbi: 123456789 }, 'mock-test-user@defra.gov.uk')

    expect(result.data).toBeNull()
    expect(result.errors).toBeDefined()
    expect(result.errors[0].message).toBe('SBI not found')
    expect(result.errors[0].extensions.code).toBe('NOT_FOUND')
    expect(result.statusCode).toBe(404)

    expect(global.fetch).toHaveBeenCalledWith(
      'http://test-dal-endpoint/graphql',
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer mock-token',
          email: 'mock-test-user@defra.gov.uk'
        },
        body: JSON.stringify({
          query: exampleQuery,
          variables: {
            sbi: 123456789
          }
        })
      }
    )
  })

  test('should handle successful response from DAL without errors', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        data: {
          business: {
            sbi: 123456789,
            name: 'Test Business'
          }
        },
        errors: null
      })
    })

    const result = await dalConnector(exampleQuery, { sbi: 123456789 }, 'mock-test-user@defra.gov.uk')

    expect(result.data).toBeDefined()
    expect(result.errors).toBeNull()
    expect(result.statusCode).toBe(200)
  })

  test('should throw error when email header is missing', async () => {
    const result = await dalConnector(exampleQuery, { sbi: 123456789 })

    expect(result.data).toBeNull()
    expect(result.statusCode).toBe(400)
    expect(result.errors).toBeDefined()
    expect(result.errors[0].message).toBe('DAL connection cannot be made if email header is missing')
  })

  test('should handle network errors in catch block', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const result = await dalConnector(exampleQuery, { sbi: 123456789 }, 'mock-test-user@defra.gov.uk')

    expect(result.data).toBeNull()
    expect(result.statusCode).toBe(500)
    expect(result.errors[0].message).toBe('Network error')
  })
})
