import { describe, test, expect, jest } from '@jest/globals'
import {
  getBusinessPhoneNumbersCheck,
  postBusinessPhoneNumbersCheck,
  businessPhoneNumbersCheckRoutes
} from '../../../../src/routes/business-details/business-phone-numbers-check.js'

describe('Business Phone Numbers Check Routes Unit Tests', () => {
  describe('GET /business-phone-numbers-check', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessPhoneNumbersCheck.method).toBe('GET')
      expect(getBusinessPhoneNumbersCheck.path).toBe('/business-phone-numbers-check')
    })

    test('should render the correct view with business phone numbers from state', () => {
      const request = {
        state: {
          businessTelephone: '0123456789',
          businessMobile: '9876543210'
        }
      }

      const h = {
        view: jest.fn().mockReturnThis()
      }

      getBusinessPhoneNumbersCheck.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-phone-numbers-check', {
        businessTelephone: '0123456789',
        businessMobile: '9876543210'
      })
    })

    test('should render the correct view with empty string when no business name in state', () => {
      const request = {
        state: {}
      }

      const h = {
        view: jest.fn().mockReturnThis()
      }

      getBusinessPhoneNumbersCheck.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-phone-numbers-check', {
        businessTelephone: '',
        businessMobile: ''
      })
    })
  })

  describe('POST /business-phone-numbers-check', () => {
    test('should have the correct method and path', () => {
      expect(postBusinessPhoneNumbersCheck.method).toBe('POST')
      expect(postBusinessPhoneNumbersCheck.path).toBe('/business-phone-numbers-check')
    })

    test('should redirect to business-details with success banner and business phone number state', () => {
      const request = {
        state: {
          businessTelephone: '01234567890',
          businessMobile: '07123456789'
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

      postBusinessPhoneNumbersCheck.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-details')
      expect(stateMock).toHaveBeenCalledWith('showSuccessBanner', 'true')
      expect(stateMock).toHaveBeenCalledWith('businessTelephone', '01234567890')
      expect(stateMock).toHaveBeenCalledWith('businessMobile', '07123456789')
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessTelephone')
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessMobile')
    })

    test('should handle undefine business phone numbers in state', () => {
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

      postBusinessPhoneNumbersCheck.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-details')
      expect(stateMock).toHaveBeenCalledWith('showSuccessBanner', 'true')
      expect(stateMock).toHaveBeenCalledWith('businessTelephone', undefined)
      expect(stateMock).toHaveBeenCalledWith('businessMobile', undefined)
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessTelephone')
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessMobile')
    })

    test('should export all routes', () => {
      expect(businessPhoneNumbersCheckRoutes).toEqual([
        getBusinessPhoneNumbersCheck,
        postBusinessPhoneNumbersCheck
      ])
    })
  })
})
