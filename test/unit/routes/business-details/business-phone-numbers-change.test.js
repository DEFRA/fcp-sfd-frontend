import { describe, test, expect, vi } from 'vitest'
import { businessPhoneNumbersChangeRoutes } from '../../../../src/routes/business-details/business-phone-numbers-change.js'

const [getBusinessPhoneNumbersChange, postBusinessPhoneNumbersChange] = businessPhoneNumbersChangeRoutes

const businessTelephone = '0123456789'
const businessMobile = '9876543210'

const createMockResponse = () => {
  const view = vi.fn().mockReturnThis()
  const code = vi.fn().mockReturnThis()
  const takeover = vi.fn().mockReturnThis()
  const state = vi.fn().mockReturnThis()
  const redirect = vi.fn().mockReturnValue({ state })

  return { view, code, takeover, state, redirect }
}

describe('change business phone numbers', () => {
  describe('GET /business-phone-numbers-change', () => {
    test('should have correct method and path', () => {
      expect(getBusinessPhoneNumbersChange.method).toBe('GET')
      expect(getBusinessPhoneNumbersChange.path).toBe('/business-phone-numbers-change')
    })

    test('should render view with phone numbers from state', () => {
      const request = {
        state: { businessTelephone, businessMobile }
      }

      const h = createMockResponse()

      getBusinessPhoneNumbersChange.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-phone-numbers-change', {
        businessTelephone,
        businessMobile
      })
    })
  })

  describe('POST /business-phone-numbers-change', () => {
    test('should have correct method and path', () => {
      expect(postBusinessPhoneNumbersChange.method).toBe('POST')
      expect(postBusinessPhoneNumbersChange.path).toBe('/business-phone-numbers-change')
    })

    describe('validation', () => {
      const schema = postBusinessPhoneNumbersChange.options.validate.payload

      test('should fail with empty fields', () => {
        const { error } = schema.validate({
          businessTelephone: '',
          businessMobile: ''
        })

        expect(error).toBeTruthy()
        expect(error.details.length).toBeGreaterThan(0)
      })

      test('should pass with valid phone numbers', () => {
        const { error } = schema.validate({
          businessTelephone,
          businessMobile
        })

        expect(error).toBeFalsy()
      })
    })

    test('should redirect to check page on successful submission', () => {
      const request = {
        payload: { businessTelephone, businessMobile }
      }

      const h = createMockResponse()

      postBusinessPhoneNumbersChange.options.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-phone-numbers-check')
    })

    test('should handle validation failures with error details', async () => {
      const request = {
        payload: {
          businessTelephone: '',
          businessMobile: ''
        }
      }

      const h = createMockResponse()

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
          businessTelephone: { text: 'Enter a business telephone number' },
          businessMobile: { text: 'Enter a business mobile number' }
        }
      })

      expect(h.code).toHaveBeenCalledWith(400)
      expect(h.takeover).toHaveBeenCalled()
    })

    test('should handle validation failure without error details', async () => {
      const request = {
        payload: {
          businessTelephone: '',
          businessMobile: ''
        }
      }

      const h = createMockResponse()
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
