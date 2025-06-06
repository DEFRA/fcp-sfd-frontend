import { vi, beforeEach, describe, test, expect } from 'vitest'
import { dalConnector } from '../../../src/dal/connector.js'
import { config } from '../../../src/config/index.js'
import { getSbi } from '../../../src/dal/queries/get-sbi.js'

describe('Handle DAL (data access layer) connection', () => {
  const mockEmail = 'mockemail@test.com'
  const mockVariables = { sbi: 123456789 }

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
    const result = await dalConnector(getSbi, mockVariables, mockEmail)

    expect(global.fetch).toHaveBeenCalledWith(config.get('dalConfig.endpoint'), {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        email: 'mockemail@test.com'
      },
      body: JSON.stringify({
        query: getSbi,
        variables: mockVariables
      })
    })

    expect(result).toEqual(mockResponse)
  })

  test('should handle fetch errors', async () => {
    const mockError = new Error('Network error')
    global.fetch.mockRejectedValue(mockError)

    await expect(dalConnector(getSbi, mockVariables, mockEmail)).rejects.toThrow('Network error')
  })
})
