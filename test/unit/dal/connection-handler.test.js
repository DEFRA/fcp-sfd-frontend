import { vi, beforeEach, describe, test, expect } from 'vitest'
import { dalConnectionHandler } from '../../../src/dal/connection-handler.js'
import { mockQuery } from '../../mocks/query.js'

vi.mock('../../../src/config/index.js', () => ({
  config: {
    get: vi.fn((config) => {
      const configMap = {
        'dalConfig.endpoint': 'http://mock-endpoint/graphql',
        'dalConfig.emailAddress': 'mock.email@test.com'
      }
      return configMap[config]
    })
  }
}))

vi.mock('../../../src/utils/logger.js', () => ({
  createLogger: vi.fn(() => ({
    error: vi.fn()
  }))
}))

describe('Handle DAL (data access layer) connection', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
    vi.clearAllMocks()
  })

  test('should fetch dal api endpoint with correct params and return response data', async () => {
    const mockResponse = {
      data: {
        business: {
          sbi: '123456789'
        }
      }
    }

    global.fetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockResponse)
    })

    const result = await dalConnectionHandler(mockQuery)

    expect(global.fetch).toHaveBeenCalledWith('http://mock-endpoint/graphql', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        email: 'mock.email@test.com'
      },
      body: JSON.stringify({ query: mockQuery })
    })

    expect(result).toEqual(mockResponse)
  })

  test('should handle fetch errors', async () => {
    const mockError = new Error('Network error')
    global.fetch.mockRejectedValue(mockError)

    const result = await dalConnectionHandler(mockQuery)

    expect(result).toBeUndefined()
  })
})
