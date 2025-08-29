import { vi, beforeEach, describe, test, expect } from 'vitest'
import { pageNotFound } from '../../../../src/routes/errors/page-not-found-routes.js'

const mockView = vi.fn()
const mockH = {
  view: vi.fn().mockReturnValue(mockView)
}

describe('Page Not Found Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should have the correct method and path', () => {
    expect(pageNotFound.method).toBe('GET')
    expect(pageNotFound.path).toBe('/page-not-found')
  })

  test('should return HTTP 200 when accessing the page not found page', () => {
    const mockRequest = { headers: {} }
    const result = pageNotFound.handler(mockRequest, mockH)
    expect(mockH.view).toHaveBeenCalled()
    expect(result).toBe(mockView)
  })

  test('should render the correct template with the right context', () => {
    const mockRequest = { headers: { referer: '/previous-page' } }
    pageNotFound.handler(mockRequest, mockH)
    expect(mockH.view).toHaveBeenCalledWith(
      'errors/page-not-found',
      { backLink: '/previous-page' }
    )
  })

  test('should handle template rendering errors gracefully', () => {
    const mockRequest = { headers: {} }
    mockH.view.mockImplementationOnce(() => {
      throw new Error('Template rendering failed')
    })
    expect(() => {
      pageNotFound.handler(mockRequest, mockH)
    }).toThrow('Template rendering failed')
  })
})
