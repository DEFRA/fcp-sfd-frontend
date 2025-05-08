import { describe, test, expect, vi } from 'vitest'
import { businessPhoneNumbersChangeRoutes } from '../../../../src/routes/business-details/business-phone-numbers-change.js'

const [getBusinessPhoneNumbersChange, postBusinessPhoneNumbersChange] = businessPhoneNumbersChangeRoutes

describe('Business Phone Numbers Change Routes Unit Tests', () => {
  const businessTelephone = '0123456789'
  const businessMobile = '9876543210'

  describe('GET /business-phone-numbers-change', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessPhoneNumbersChange.method).toBe('GET')
      expect(getBusinessPhoneNumbersChange.path).toBe('/business-phone-numbers-change')
    })

    test('should render the correct view with correct data', () => {
      const request = {
        state: {
          businessTelephone,
          businessMobile
        }
      }

      const stateMock = vi.fn().mockReturnThis()

      const h = {
        view: vi.fn().mockReturnValue({
          state: stateMock
        })
      }

      getBusinessPhoneNumbersChange.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-phone-numbers-change', {
        businessTelephone: '0123456789',
        businessMobile: '9876543210'
      })
    })
  })

  describe('POST /business-phone-numbers-change', () => {
    test('should have the correct method and path', () => {
      expect(postBusinessPhoneNumbersChange.method).toBe('POST')
      expect(postBusinessPhoneNumbersChange.path).toBe('/business-phone-numbers-change')
    })

    describe('Validation', () => {
      test('should validate empty fields', () => {
        const schema = postBusinessPhoneNumbersChange.options.validate.payload

        const result = schema.validate({
          businessTelephone: '',
          businessMobile: ''
        })

        expect(result.error).toBeTruthy()
        expect(result.error.details.length).toBeGreaterThan(0)
      })

      test('should accept valid phone numbers', () => {
        const schema = postBusinessPhoneNumbersChange.options.validate.payload

        const result = schema.validate({
          businessTelephone,
          businessMobile
        })

        expect(result.error).toBeFalsy()
      })
    })

    test('should redirect to check page on successful submission', () => {
      const request = {
        payload: {
          businessTelephone,
          businessMobile
        }
      }

      const stateMock = vi.fn().mockReturnThis()

      const h = {
        redirect: vi.fn().mockReturnValue({
          state: stateMock
        })
      }

      postBusinessPhoneNumbersChange.options.handler(request, h)

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
        view: vi.fn().mockReturnThis(),
        code: vi.fn().mockReturnThis(),
        takeover: vi.fn().mockReturnThis()
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

      await postBusinessPhoneNumbersChange.options.validate.failAction(request, h, err)

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
        view: vi.fn().mockReturnThis(),
        code: vi.fn().mockReturnThis(),
        takeover: vi.fn().mockReturnThis()
      }

      const err = {}

      await postBusinessPhoneNumbersChange.options.validate.failAction(request, h, err)

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
      getBusinessPhoneNumbersChange,
      postBusinessPhoneNumbersChange
    ])
  })
})
