import { describe, test, expect, vi } from 'vitest'
import { businessNameCheckRoutes } from '../../../../src/routes/business/business-name-check-routes.js'

const [getBusinessNameCheck, postBusinessNameCheck] = businessNameCheckRoutes

const createMockRequest = (state = {}) => ({ state })

const createMockResponse = () => {
  const view = vi.fn().mockReturnThis()
  const redirect = vi.fn()
  const stateMock = vi.fn().mockReturnThis()
  const unstateMock = vi.fn().mockReturnThis()

  redirect.mockReturnValue({ state: stateMock, unstate: unstateMock })

  return { h: { view, redirect }, view, redirect, stateMock, unstateMock }
}

describe('check business name', () => {
  describe('GET /business-name-check', () => {
    test('should have correct method and path', () => {
      expect(getBusinessNameCheck.method).toBe('GET')
      expect(getBusinessNameCheck.path).toBe('/business-name-check')
    })

    test('should render view with business name from state', () => {
      const request = createMockRequest({ businessName: 'Test Business' })
      const { h, view } = createMockResponse()

      getBusinessNameCheck.handler(request, h)

      expect(view).toHaveBeenCalledWith('business/business-name-check', {
        businessName: 'Test Business'
      })
    })

    test('should render view with empty string if no business name in state', () => {
      const request = createMockRequest({})
      const { h, view } = createMockResponse()

      getBusinessNameCheck.handler(request, h)

      expect(view).toHaveBeenCalledWith('business/business-name-check', {
        businessName: ''
      })
    })
  })

  describe('POST /business-name-check', () => {
    test('should have correct method and path', () => {
      expect(postBusinessNameCheck.method).toBe('POST')
      expect(postBusinessNameCheck.path).toBe('/business-name-check')
    })

    test('should redirect to business-details with success banner and name state', () => {
      const request = createMockRequest({ businessName: 'Test Business' })
      const { h, redirect, stateMock, unstateMock } = createMockResponse()

      postBusinessNameCheck.handler(request, h)

      expect(redirect).toHaveBeenCalledWith('/business-details')
      expect(stateMock).toHaveBeenCalledWith('showSuccessBanner', 'true')
      expect(stateMock).toHaveBeenCalledWith('businessName', 'Test Business')
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessName')
    })

    test('should handle undefined business name in state gracefully', () => {
      const request = createMockRequest({})
      const { h, redirect, stateMock, unstateMock } = createMockResponse()

      postBusinessNameCheck.handler(request, h)

      expect(redirect).toHaveBeenCalledWith('/business-details')
      expect(stateMock).toHaveBeenCalledWith('showSuccessBanner', 'true')
      expect(stateMock).toHaveBeenCalledWith('businessName', undefined)
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessName')
    })
  })

  test('should export both route handlers', () => {
    expect(businessNameCheckRoutes).toEqual([
      getBusinessNameCheck,
      postBusinessNameCheck
    ])
  })
})
