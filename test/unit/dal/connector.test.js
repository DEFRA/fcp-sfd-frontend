import { vi, beforeEach, describe, test, expect } from 'vitest'
import { dalConnector } from '../../../src/dal/connector.js'
import { config } from '../../../src/config/index.js'
import { mockQuery } from '../../mocks/query.js'

describe('Handle DAL (data access layer) connection', () => {
  const mockEmail = 'mockemail@test.com'

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

    const result = await dalConnector(mockQuery, mockEmail)

    expect(global.fetch).toHaveBeenCalledWith(config.get('dalConfig.endpoint'), {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        email: 'mockemail@test.com'
      },
      body: JSON.stringify({ query: mockQuery })
    })

    expect(result).toEqual(mockResponse)
  })

  test('should handle fetch errors', async () => {
    const mockError = new Error('Network error')
    global.fetch.mockRejectedValue(mockError)

    await expect(dalConnector(mockQuery, mockEmail)).rejects.toThrow('Network error')
  })
})
