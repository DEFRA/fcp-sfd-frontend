import { describe, test, expect, vi } from 'vitest'
import { businessEmailChangeRoutes } from '../../../../src/routes/business/business-email-change.routes.js'

const [getBusinessEmailChange, postBusinessEmailChange] = businessEmailChangeRoutes

const createMockRequest = (overrides = {}) => ({
  payload: {
    businessEmail: 'name@example.com',
    ...overrides
  },
  state: {
    businessEmail: 'name@example.com',
    ...overrides
  }
})

const createMockResponse = () => {
  const stateMock = vi.fn().mockReturnThis()
  const view = vi.fn().mockReturnThis()
  const redirect = vi.fn().mockReturnThis()
  const code = vi.fn().mockReturnThis()
  const takeover = vi.fn().mockReturnThis()

  return {
    h: { view, redirect, code, takeover },
    stateMock,
    view,
    redirect,
    code,
    takeover
  }
}

describe('change business email', () => {
  describe('GET /business-email-change', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessEmailChange.method).toBe('GET')
      expect(getBusinessEmailChange.path).toBe('/business-email-change')
    })

    test('should render the correct view with data', () => {
      const request = createMockRequest()
      const stateMock = vi.fn().mockReturnThis()

      const h = {
        view: vi.fn().mockReturnValue({ state: stateMock })
      }

      getBusinessEmailChange.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business/business-email-change', {
        businessEmail: 'name@example.com'
      })

      expect(stateMock).toHaveBeenCalledWith('originalBusinessEmail', 'name@example.com')
    })
  })

  describe('POST /business-email-change', () => {
    const schema = postBusinessEmailChange.options.validate.payload

    test('should have the correct method and path', () => {
      expect(postBusinessEmailChange.method).toBe('POST')
      expect(postBusinessEmailChange.path).toBe('/business-email-change')
    })

    describe('validation', () => {
      test('should fail on empty business email', () => {
        const result = schema.validate({ businessEmail: '' })

        expect(result.error).toBeTruthy()
        expect(result.error.details[0].message).toBe('Enter business email address')
      })

      test('should fail on invalid email', () => {
        const result = schema.validate({ businessEmail: 'not-an-email' })

        expect(result.error).toBeTruthy()
        expect(result.error.details[0].message).toBe('Enter an email address, like name@example.com')
      })

      test('should accept valid email', () => {
        const result = schema.validate({ businessEmail: 'name@example.com' })

        expect(result.error).toBeFalsy()
      })
    })

    test('should redirect on successful submission', () => {
      const request = createMockRequest()
      const stateMock = vi.fn().mockReturnThis()

      const h = {
        redirect: vi.fn().mockReturnValue({ state: stateMock })
      }

      postBusinessEmailChange.options.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-email-check')
      expect(stateMock).toHaveBeenCalledWith('businessEmail', 'name@example.com')
    })

    describe('validation failAction', () => {
      test('should handle specific validation error', async () => {
        const request = createMockRequest({ businessEmail: '' })
        const { h } = createMockResponse()

        const err = {
          details: [{ path: ['businessEmail'], message: 'Enter business email address' }]
        }

        await postBusinessEmailChange.options.validate.failAction(request, h, err)

        expect(h.view).toHaveBeenCalledWith('business/business-email-change', {
          businessEmail: '',
          errors: {
            businessEmail: { text: 'Enter business email address' }
          }
        })

        expect(h.code).toHaveBeenCalledWith(400)
        expect(h.takeover).toHaveBeenCalled()
      })

      test('should handle error with undefined details', async () => {
        const request = createMockRequest({ businessEmail: '' })
        const { h } = createMockResponse()

        await postBusinessEmailChange.options.validate.failAction(request, h, {})

        expect(h.view).toHaveBeenCalledWith('business/business-email-change', {
          businessEmail: '',
          errors: {}
        })

        expect(h.code).toHaveBeenCalledWith(400)
        expect(h.takeover).toHaveBeenCalled()
      })
    })
  })

  test('should export all routes', () => {
    expect(businessEmailChangeRoutes).toEqual([
      getBusinessEmailChange,
      postBusinessEmailChange
    ])
  })
})
