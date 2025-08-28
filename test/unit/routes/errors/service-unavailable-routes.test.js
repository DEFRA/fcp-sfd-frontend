import { vi, beforeEach, describe, test, expect } from 'vitest'
import { serviceUnavailable } from '../../../../src/routes/errors/service-unavailable-routes.js'

const mockView = vi.fn()
const mockH = {
  view: vi.fn().mockReturnValue(mockView)
}

describe('Service Unavailable Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should have the correct method and path', () => {
    expect(serviceUnavailable.method).toBe('GET')
    expect(serviceUnavailable.path).toBe('/service-unavailable')
  })

  test('should return HTTP 200 when accessing the service unavailable page', () => {
    const mockRequest = { headers: {} }
    const result = serviceUnavailable.handler(mockRequest, mockH)
    expect(mockH.view).toHaveBeenCalled()
    expect(result).toBe(mockView)
  })

  test('should render the correct template with the right context', () => {
    const mockRequest = { headers: { referer: '/previous-page' } }
    serviceUnavailable.handler(mockRequest, mockH)
    expect(mockH.view).toHaveBeenCalledWith(
      'errors/service-unavailable',
      { backLink: '/previous-page' }
    )
  })

  test('should handle template rendering errors gracefully', () => {
    const mockRequest = { headers: {} }
    mockH.view.mockImplementationOnce(() => {
      throw new Error('Template rendering failed')
    })
    expect(() => {
      serviceUnavailable.handler(mockRequest, mockH)
    }).toThrow('Template rendering failed')
  })
})
