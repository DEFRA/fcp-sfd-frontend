import { describe, test, expect, vi } from 'vitest'
import { businessEmailCheckRoutes } from '../../../../src/routes/business-details/business-email-check.js'

const [getBusinessEmailCheck, postBusinessEmailCheck] = businessEmailCheckRoutes

const createMockRequest = (state = {}) => ({ state })

const createMockResponse = () => {
  const stateMock = vi.fn().mockReturnThis()
  const unstateMock = vi.fn().mockReturnThis()
  const view = vi.fn().mockReturnThis()
  const redirect = vi.fn().mockReturnValue({ state: stateMock, unstate: unstateMock })

  return {
    h: { view, redirect },
    stateMock,
    unstateMock,
    view,
    redirect
  }
}

describe('check business email', () => {
  describe('GET /business-email-check', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessEmailCheck.method).toBe('GET')
      expect(getBusinessEmailCheck.path).toBe('/business-email-check')
    })

    test('should render the view with business email from state', () => {
      const request = createMockRequest({ businessEmail: 'name@example.com' })
      const { h, view } = createMockResponse()

      getBusinessEmailCheck.handler(request, h)

      expect(view).toHaveBeenCalledWith('business-details/business-email-check', {
        businessEmail: 'name@example.com'
      })
    })

    test('should render the view with empty email when none provided', () => {
      const request = createMockRequest()
      const { h, view } = createMockResponse()

      getBusinessEmailCheck.handler(request, h)

      expect(view).toHaveBeenCalledWith('business-details/business-email-check', {
        businessEmail: ''
      })
    })
  })

  describe('POST /business-email-check', () => {
    test('should have the correct method and path', () => {
      expect(postBusinessEmailCheck.method).toBe('POST')
      expect(postBusinessEmailCheck.path).toBe('/business-email-check')
    })

    test('should redirect with success banner and email in state', () => {
      const request = createMockRequest({ businessEmail: 'name@example.com' })
      const { h, stateMock, unstateMock, redirect } = createMockResponse()

      postBusinessEmailCheck.handler(request, h)

      expect(redirect).toHaveBeenCalledWith('/business-details')
      expect(stateMock).toHaveBeenCalledWith('showSuccessBanner', 'true')
      expect(stateMock).toHaveBeenCalledWith('businessEmail', 'name@example.com')
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessEmail')
    })

    test('should handle missing business email in state', () => {
      const request = createMockRequest()
      const { h, stateMock, unstateMock, redirect } = createMockResponse()

      postBusinessEmailCheck.handler(request, h)

      expect(redirect).toHaveBeenCalledWith('/business-details')
      expect(stateMock).toHaveBeenCalledWith('showSuccessBanner', 'true')
      expect(stateMock).toHaveBeenCalledWith('businessEmail', undefined)
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessEmail')
    })
  })

  test('should export both routes', () => {
    expect(businessEmailCheckRoutes).toEqual([
      getBusinessEmailCheck,
      postBusinessEmailCheck
    ])
  })
})
