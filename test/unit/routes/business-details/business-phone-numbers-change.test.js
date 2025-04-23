import { describe, test, expect, jest } from '@jest/globals'
import {
  getBusinessPhoneNumberChange,
  postBusinessPhoneNumberChange,
  businessPhoneNumbersChangeRoutes
} from '../../../../src/routes/business-details/business-phone-numbers-change.js'

describe('Business Phone Numbers Routes Unit Tests', () => {
  describe('GET /business-phone-numbers-change', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessPhoneNumberChange.method).toBe('GET')
      expect(getBusinessPhoneNumberChange.path).toBe('/business-phone-numbers-change')
    })

    test('should render the correct view', () => {
      const h = {
        view: jest.fn()
      }

      getBusinessPhoneNumberChange.handler({}, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-phone-numbers-change')
    })
  })

  describe('POST /business-phone-numbers-change', () => {
    test('should have the correct method and path', () => {
      expect(postBusinessPhoneNumberChange.method).toBe('POST')
      expect(postBusinessPhoneNumberChange.path).toBe('/business-phone-numbers-change')
    })

    describe('Validation', () => {
      test('should validate empty fields', () => {
        const schema = postBusinessPhoneNumberChange.options.validate.payload

        const result = schema.validate({
          businessTelephone: '',
          businessMobile: ''
        })

        expect(result.error).toBeTruthy()
        expect(result.error.details.length).toBeGreaterThan(0)
      })

      test('should accept valid phone numbers', () => {
        const schema = postBusinessPhoneNumberChange.options.validate.payload

        const result = schema.validate({
          businessTelephone: '01234567890',
          businessMobile: '07123456789'
        })

        expect(result.error).toBeFalsy()
      })
    })

    test('should redirect to check page on successful submission', () => {
      const request = {
        payload: {
          businessTelephone: '01234567890',
          businessMobile: '07123456789'
        }
      }

      const h = {
        redirect: jest.fn()
      }

      postBusinessPhoneNumberChange.options.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-phone-numbers-check')
    })

    test('should handle validation failures correctly', async () => {
      const request = {
        payload: {
          businessTelephone: '',
          businessMobile: ''
        }
      }

      const h = {
        view: jest.fn().mockReturnThis(),
        code: jest.fn().mockReturnThis(),
        takeover: jest.fn().mockReturnThis()
      }

      const err = {
        details: [
          {
            path: ['businessTelephone'],
            message: 'Enter a business telephone number'
          },
          {
            path: ['businessMobile'],
            message: 'Enter a business mobile number'
          }
        ]
      }

      await postBusinessPhoneNumberChange.options.validate.failAction(request, h, err)

      expect(h.view).toHaveBeenCalledWith('business-details/business-phone-numbers-change', {
        businessTelephone: '',
        businessMobile: '',
        errors: {
          businessTelephone: {
            text: 'Enter a business telephone number'
          },
          businessMobile: {
            text: 'Enter a business mobile number'
          }
        }
      })

      expect(h.code).toHaveBeenCalledWith(400)
      expect(h.takeover).toHaveBeenCalled()
    })

    test('should handle validation failure with undefined details property', async () => {
      const request = {
        payload: {
          businessTelephone: '',
          businessMobile: ''
        }
      }

      const h = {
        view: jest.fn().mockReturnThis(),
        code: jest.fn().mockReturnThis(),
        takeover: jest.fn().mockReturnThis()
      }

      const err = {}

      await postBusinessPhoneNumberChange.options.validate.failAction(request, h, err)

      expect(h.view).toHaveBeenCalledWith('business-details/business-phone-numbers-change', {
        businessTelephone: '',
        businessMobile: '',
        errors: {}
      })

      expect(h.code).toHaveBeenCalledWith(400)
      expect(h.takeover).toHaveBeenCalled()
    })
  })

  test('should export all routes', () => {
    expect(businessPhoneNumbersChangeRoutes).toEqual([
      getBusinessPhoneNumberChange,
      postBusinessPhoneNumberChange
    ])
  })
})
