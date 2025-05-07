import { describe, test, expect, vi } from 'vitest'
import {
  businessEmailChangeRoutes
} from '../../../../src/routes/business-details/business-email-change.js'

const [getBusinessEmailChange, postBusinessEmailChange] = businessEmailChangeRoutes

describe('Business Email Routes Unit Tests', () => {
  describe('GET /business-email-change', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessEmailChange.method).toBe('GET')
      expect(getBusinessEmailChange.path).toBe('/business-email-change')
    })

    test('should render the correct view with correct data', () => {
      const request = {
        state: {
          businessEmail: 'name@example.com'
        }
      }

      const stateMock = vi.fn().mockReturnThis()

      const h = {
        view: vi.fn().mockReturnValue({
          state: stateMock
        })
      }

      getBusinessEmailChange.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-email-change', {
        businessEmail: 'name@example.com'
      })

      expect(stateMock).toHaveBeenCalledWith('originalBusinessEmail', 'name@example.com')
    })
  })

  describe('POST /business-email-change', () => {
    test('should have the correct method and path', () => {
      expect(postBusinessEmailChange.method).toBe('POST')
      expect(postBusinessEmailChange.path).toBe('/business-email-change')
    })

    describe('Validation', () => {
      const schema = postBusinessEmailChange.options.validate.payload

      test('should validate empty business email', () => {
        const result = schema.validate({ businessEmail: '' })

        expect(result.error).toBeTruthy()
        expect(result.error.details[0].message).toBe('Enter business email address')
      })

      test('should validate invalid business email', () => {
        const schema = postBusinessEmailChange.options.validate.payload

        const result = schema.validate({ businessEmail: 'not-an-email' })

        expect(result.error).toBeTruthy()
        expect(result.error.details[0].message).toBe('Enter an email address, like name@example.com')
      })

      test('should accept valid business email', () => {
        const result = schema.validate({ businessEmail: 'name@example.com' })

        expect(result.error).toBeFalsy()
      })
    })

    test('should redirect to business email check page on successful submission', () => {
      const request = {
        payload: {
          businessEmail: 'name@example.com'
        }
      }

      const stateMock = vi.fn().mockReturnThis()

      const h = {
        redirect: vi.fn().mockReturnValue({
          state: stateMock
        })
      }

      postBusinessEmailChange.options.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-email-check')
      expect(stateMock).toHaveBeenCalledWith('businessEmail', 'name@example.com')
    })

    test('should handle validation failures correctly', async () => {
      const request = {
        payload: { businessEmail: '' }
      }

      const h = {
        view: vi.fn().mockReturnThis(),
        code: vi.fn().mockReturnThis(),
        takeover: vi.fn().mockReturnThis()
      }

      const err = {
        details: [
          {
            path: ['businessEmail'],
            message: 'Enter business email address'
          }
        ]
      }

      await postBusinessEmailChange.options.validate.failAction(request, h, err)

      expect(h.view).toHaveBeenCalledWith('business-details/business-email-change', {
        businessEmail: '',
        errors: {
          businessEmail: {
            text: 'Enter business email address'
          }
        }
      })

      expect(h.code).toHaveBeenCalledWith(400)
      expect(h.takeover).toHaveBeenCalled()
    })

    test('should handle validation failures with undefined details property', async () => {
      const request = {
        payload: {
          businessEmail: ''
        }
      }

      const h = {
        view: vi.fn().mockReturnThis(),
        code: vi.fn().mockReturnThis(),
        takeover: vi.fn().mockReturnThis()
      }

      const err = {}

      await postBusinessEmailChange.options.validate.failAction(request, h, err)

      expect(h.view).toHaveBeenCalledWith('business-details/business-email-change', {
        businessEmail: '',
        errors: {}
      })

      expect(h.code).toHaveBeenCalledWith(400)
      expect(h.takeover).toHaveBeenCalled()
    })
  })

  test('should export all routes', () => {
    expect(businessEmailChangeRoutes).toEqual([
      getBusinessEmailChange,
      postBusinessEmailChange
    ])
  })
})
