import { constants as httpConstants } from 'http2'
import { health } from '../../../src/routes/health'
import { jest } from '@jest/globals'

const mockResponse = {
  code: jest.fn().mockReturnThis(),
}

const mockH = {
  response: jest.fn().mockReturnValue(mockResponse),
}

describe('Health endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should have the correct method and path', () => {
    expect(health.method).toBe('GET')
    expect(health.path).toBe('/health')
  })

  test('should return success message with 200 status code', () => {
    const result = health.handler(null, mockH)

    expect(mockH.response).toHaveBeenCalledWith({ message: 'success' })

    expect(mockResponse.code).toHaveBeenCalledWith(httpConstants.HTTP_STATUS_OK)

    expect(result).toBe(mockResponse)
  })
})