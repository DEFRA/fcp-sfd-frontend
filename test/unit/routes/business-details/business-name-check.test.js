import { describe, test, expect, vi } from 'vitest'
import { businessNameCheckRoutes } from '../../../../src/routes/business-details/business-name-check.js'

const [getBusinessNameCheck, postBusinessNameCheck] = businessNameCheckRoutes

describe('Business Name Check Routes Unit Tests', () => {
  describe('GET /business-name-check', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessNameCheck.method).toBe('GET')
      expect(getBusinessNameCheck.path).toBe('/business-name-check')
    })

    test('should render the correct view with business name from state', () => {
      const request = {
        state: {
          businessName: 'Test Business'
        }
      }

      const h = {
        view: vi.fn().mockReturnThis()
      }

      getBusinessNameCheck.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-name-check', {
        businessName: 'Test Business'
      })
    })

    test('should render the correct view with empty string when no business name in state', () => {
      const request = {
        state: {}
      }

      const h = {
        view: vi.fn().mockReturnThis()
      }

      getBusinessNameCheck.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-name-check', {
        businessName: ''
      })
    })
  })

  describe('POST /business-name-check', () => {
    test('should have the correct method and path', () => {
      expect(postBusinessNameCheck.method).toBe('POST')
      expect(postBusinessNameCheck.path).toBe('/business-name-check')
    })

    test('should redirect to business-details with success banner and business name state', () => {
      const request = {
        state: {
          businessName: 'Test Business'
        }
      }

      const stateMock = vi.fn().mockReturnThis()
      const unstateMock = vi.fn().mockReturnThis()

      const h = {
        redirect: vi.fn().mockReturnValue({
          state: stateMock,
          unstate: unstateMock
        })
      }

      postBusinessNameCheck.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-details')
      expect(stateMock).toHaveBeenCalledWith('showSuccessBanner', 'true')
      expect(stateMock).toHaveBeenCalledWith('businessName', 'Test Business')
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessName')
    })

    test('should handle undefined business name in state', () => {
      const request = {
        state: {}
      }

      const stateMock = vi.fn().mockReturnThis()
      const unstateMock = vi.fn().mockReturnThis()

      const h = {
        redirect: vi.fn().mockReturnValue({
          state: stateMock,
          unstate: unstateMock
        })
      }

      postBusinessNameCheck.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-details')
      expect(stateMock).toHaveBeenCalledWith('showSuccessBanner', 'true')
      expect(stateMock).toHaveBeenCalledWith('businessName', undefined)
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessName')
    })
  })

  test('should export all routes', () => {
    expect(businessNameCheckRoutes).toEqual([
      getBusinessNameCheck,
      postBusinessNameCheck
    ])
  })
})
