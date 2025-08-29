import { vi, beforeEach, describe, test, expect } from 'vitest'
import { serviceProblem } from '../../../../src/routes/errors/service-problem-routes.js'

const mockView = vi.fn()
const mockH = {
  view: vi.fn().mockReturnValue(mockView)
}

describe('Service Problem Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should have the correct method and path', () => {
    expect(serviceProblem.method).toBe('GET')
    expect(serviceProblem.path).toBe('/service-problem')
  })

  test('should return HTTP 200 when accessing the service problem page', () => {
    const mockRequest = { headers: {} }
    const result = serviceProblem.handler(mockRequest, mockH)
    expect(mockH.view).toHaveBeenCalled()
    expect(result).toBe(mockView)
  })

  test('should render the correct template with the right context', () => {
    const mockRequest = { headers: { referer: '/previous-page' } }
    serviceProblem.handler(mockRequest, mockH)
    expect(mockH.view).toHaveBeenCalledWith(
      'errors/service-problem',
      { backLink: '/previous-page' }
    )
  })

  test('should handle template rendering errors gracefully', () => {
    const mockRequest = { headers: {} }
    mockH.view.mockImplementationOnce(() => {
      throw new Error('Template rendering failed')
    })
    expect(() => {
      serviceProblem.handler(mockRequest, mockH)
    }).toThrow('Template rendering failed')
  })
})
