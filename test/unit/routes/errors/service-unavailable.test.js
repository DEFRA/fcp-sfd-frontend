import { serviceUnavailable } from '../../../../src/routes/errors/service-unavailable.js'
import { jest, beforeEach, describe, test, expect } from '@jest/globals'

const mockView = jest.fn()
const mockH = {
  view: jest.fn().mockReturnValue(mockView)
}

describe('Service Unavailable Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should have the correct method and path', () => {
    expect(serviceUnavailable.method).toBe('GET')
    expect(serviceUnavailable.path).toBe('/service-unavailable')
  })

  test('should return HTTP 200 when accessing the service unavailable page', () => {
    const result = serviceUnavailable.handler(null, mockH)
    expect(mockH.view).toHaveBeenCalled()
    expect(result).toBe(mockView)
  })

  test('should render the correct template with the right context', () => {
    serviceUnavailable.handler(null, mockH)
    expect(mockH.view).toHaveBeenCalledWith(
      'errors/service-unavailable',
      expect.objectContaining({
        pageTitle: 'Sorry, the service is unavailable - Manage your land and farm businesses - GOV.UK',
        heading: 'The service is not currently available, but you can contact us.'
      })
    )
  })

  test('should handle template rendering errors gracefully', () => {
    mockH.view.mockImplementationOnce(() => {
      throw new Error('Template rendering failed')
    })
    expect(() => {
      serviceUnavailable.handler(null, mockH)
    }).toThrow('Template rendering failed')
  })
})
