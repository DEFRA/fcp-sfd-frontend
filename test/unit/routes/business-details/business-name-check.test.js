import { describe, test, expect, jest } from '@jest/globals'
import {
  getBusinessNameCheck,
  postBusinessNameCheck,
  businessNameCheckRoutes
} from '../../../../src/routes/business-details/business-name-check.js'

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
        view: jest.fn().mockReturnThis()
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
        view: jest.fn().mockReturnThis()
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

      const secondState = jest.fn().mockReturnThis()
      const firstState = jest.fn().mockReturnValue({
        state: secondState
      })

      const h = {
        redirect: jest.fn().mockReturnValue({
          state: firstState
        })
      }

      postBusinessNameCheck.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-details')
      expect(firstState).toHaveBeenCalledWith('showSuccessBanner', 'true')
      expect(secondState).toHaveBeenCalledWith('businessName', 'Test Business')
    })

    test('should handle undefined business name in state', () => {
      const request = {
        state: {}
      }

      const secondState = jest.fn().mockReturnThis()
      const firstState = jest.fn().mockReturnValue({
        state: secondState
      })

      const h = {
        redirect: jest.fn().mockReturnValue({
          state: firstState
        })
      }

      postBusinessNameCheck.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-details')
      expect(firstState).toHaveBeenCalledWith('showSuccessBanner', 'true')
      expect(secondState).toHaveBeenCalledWith('businessName', undefined)
    })
  })

  test('should export all routes', () => {
    expect(businessNameCheckRoutes).toEqual([
      getBusinessNameCheck,
      postBusinessNameCheck
    ])
  })
})
