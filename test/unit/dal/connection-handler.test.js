import { vi, beforeEach, describe, test, expect } from 'vitest'
import { dalConnectionHandler } from '../../../src/dal/connection-handler.js'
import { mockQuery } from '../../mocks/query.js'

describe('Handle DAL (data access layer) connection', () => {
  beforeEach(() => {
    process.env.DAL_ENDPOINT = 'http://fcp-dal-api:3005/graphql'
    process.env.DAL_EMAIL_ADDRESS = 'test.user11@defra.gov.uk'
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

    expect(global.fetch).toHaveBeenCalledWith('http://fcp-dal-api:3005/graphql', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        email: 'test.user11@defra.gov.uk'
      },
      body: JSON.stringify({ query: mockQuery })
    })

    expect(result).toEqual(mockResponse)
  })

  test('should handle fetch errors', async () => {
    const mockError = new Error('Network error')
    global.fetch.mockRejectedValue(mockError)

    const result = dalConnectionHandler(mockQuery)

    expect(result).rejects.toThrow('Network error')
  })
})
