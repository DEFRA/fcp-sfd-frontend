import { describe, test, expect, jest } from '@jest/globals'
import {
  businessEmailCheckRoutes
} from '../../../../src/routes/business-details/business-email-check.js'

const [getBusinessEmailCheck, postBusinessEmailCheck] = businessEmailCheckRoutes

describe('Business Email Check Routes Unit Tests', () => {
  describe('GET /business-email-check', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessEmailCheck.method).toBe('GET')
      expect(getBusinessEmailCheck.path).toBe('/business-email-check')
    })

    test('should render the correct view with the business email address from state', () => {
      const request = {
        state: {
          businessEmail: 'name@example.com'
        }
      }

      const h = {
        view: jest.fn().mockReturnThis()
      }

      getBusinessEmailCheck.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-email-check', {
        businessEmail: 'name@example.com'
      })
    })

    test('should render the correct view with empty string when no business email in state', () => {
      const request = {
        state: {}
      }

      const h = {
        view: jest.fn().mockReturnThis()
      }

      getBusinessEmailCheck.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-email-check', {
        businessEmail: ''
      })
    })
  })

  describe('POST /business-email-check', () => {
    test('should have the correct method and path', () => {
      expect(postBusinessEmailCheck.method).toBe('POST')
      expect(postBusinessEmailCheck.path).toBe('/business-email-check')
    })

    test('should redirect to business-details with success banner and business name state', () => {
      const request = {
        state: {
          businessEmail: 'name@example.com'
        }
      }

      const stateMock = jest.fn().mockReturnThis()
      const unstateMock = jest.fn().mockReturnThis()

      const h = {
        redirect: jest.fn().mockReturnValue({
          state: stateMock,
          unstate: unstateMock
        })
      }

      postBusinessEmailCheck.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-details')
      expect(stateMock).toHaveBeenCalledWith('showSuccessBanner', 'true')
      expect(stateMock).toHaveBeenCalledWith('businessEmail', 'name@example.com')
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessEmail')
    })

    test('should handle undefined business email in state', () => {
      const request = {
        state: {}
      }

      const stateMock = jest.fn().mockReturnThis()
      const unstateMock = jest.fn().mockReturnThis()

      const h = {
        redirect: jest.fn().mockReturnValue({
          state: stateMock,
          unstate: unstateMock
        })
      }

      postBusinessEmailCheck.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-details')
      expect(stateMock).toHaveBeenCalledWith('showSuccessBanner', 'true')
      expect(stateMock).toHaveBeenCalledWith('businessEmail', undefined)
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessEmail')
    })
  })

  test('should export all routes', () => {
    expect(businessEmailCheckRoutes).toEqual([
      getBusinessEmailCheck,
      postBusinessEmailCheck
    ])
  })
})
