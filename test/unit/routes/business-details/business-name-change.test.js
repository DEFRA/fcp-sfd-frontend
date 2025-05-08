import { describe, test, expect, vi } from 'vitest'
import { businessNameChangeRoutes } from '../../../../src/routes/business-details/business-name-change.js'

const [getBusinessNameChange, postBusinessNameChange] = businessNameChangeRoutes

describe('Business Name Change Routes', () => {
  const createMockResponse = () => {
    const state = vi.fn().mockReturnThis()
    const unstate = vi.fn().mockReturnThis()
    const view = vi.fn().mockReturnThis()
    const code = vi.fn().mockReturnThis()
    const takeover = vi.fn().mockReturnThis()
    const redirect = vi.fn().mockReturnValue({ state, unstate })

    return { view, code, takeover, redirect, state, unstate }
  }

  describe('GET /business-name-change', () => {
    test('should have correct method and path', () => {
      expect(getBusinessNameChange.method).toBe('GET')
      expect(getBusinessNameChange.path).toBe('/business-name-change')
    })

    test('should render the view with default name when none in state', () => {
      const request = { state: { businessName: null } }
      const h = createMockResponse()

      getBusinessNameChange.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-name-change', {
        businessName: 'Agile Farm Ltd'
      })

      expect(h.view().state).toHaveBeenCalledWith('originalBusinessName', 'Agile Farm Ltd')
    })
  })

  describe('POST /business-name-change', () => {
    test('should have correct method and path', () => {
      expect(postBusinessNameChange.method).toBe('POST')
      expect(postBusinessNameChange.path).toBe('/business-name-change')
    })

    describe('validation', () => {
      const schema = postBusinessNameChange.options.validate.payload

      test('should fail with empty business name', () => {
        const { error } = schema.validate({ businessName: '' })

        expect(error).toBeTruthy()
        expect(error.details[0].message).toBe('Enter business name')
      })

      test('should fail when name exceeds 300 characters', () => {
        const longName = 'a'.repeat(301)
        const { error } = schema.validate({ businessName: longName })

        expect(error).toBeTruthy()
        expect(error.details[0].message).toBe('Business name must be 300 characters or less')
      })

      test('should pass with valid name', () => {
        const { error } = schema.validate({ businessName: 'Acme Corporation' })
        expect(error).toBeFalsy()
      })
    })

    test('should redirect with updated business name', () => {
      const request = { payload: { businessName: 'Test Business' } }
      const h = createMockResponse()

      postBusinessNameChange.options.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-name-check')
      expect(h.redirect().state).toHaveBeenCalledWith('businessName', 'Test Business')
    })

    test('should handle validation failure with details', async () => {
      const request = { payload: { businessName: '' } }
      const h = createMockResponse()

      const err = {
        details: [{ path: ['businessName'], message: 'Enter business name' }]
      }

      await postBusinessNameChange.options.validate.failAction(request, h, err)

      expect(h.view).toHaveBeenCalledWith('business-details/business-name-change', {
        businessName: '',
        errors: {
          businessName: { text: 'Enter business name' }
        }
      })

      expect(h.code).toHaveBeenCalledWith(400)
      expect(h.takeover).toHaveBeenCalled()
    })

    test('should handle validation failure with no details', async () => {
      const request = { payload: { businessName: '' } }
      const h = createMockResponse()

      await postBusinessNameChange.options.validate.failAction(request, h, {})

      expect(h.view).toHaveBeenCalledWith('business-details/business-name-change', {
        businessName: '',
        errors: {}
      })

      expect(h.code).toHaveBeenCalledWith(400)
      expect(h.takeover).toHaveBeenCalled()
    })
  })

  test('should export all routes', () => {
    expect(businessNameChangeRoutes).toEqual([
      getBusinessNameChange,
      postBusinessNameChange
    ])
  })
})
