import { describe, test, expect, vi } from 'vitest'
import { businessPhoneNumbersCheckRoutes } from '../../../../src/routes/business-details/business-phone-numbers-check.js'

const [getBusinessPhoneNumbersCheck, postBusinessPhoneNumbersCheck] = businessPhoneNumbersCheckRoutes

const businessTelephone = '0123456789'
const businessMobile = '9876543210'

const createMockResponse = () => {
  const view = vi.fn().mockReturnThis()
  const code = vi.fn().mockReturnThis()
  const takeover = vi.fn().mockReturnThis()
  const state = vi.fn().mockReturnThis()
  const unstate = vi.fn().mockReturnThis()
  const redirect = vi.fn().mockReturnValue({ state, unstate })

  return { view, code, takeover, state, unstate, redirect }
}

describe('Business Phone Numbers Check Routes', () => {
  describe('GET /business-phone-numbers-check', () => {
    test('has correct method and path', () => {
      expect(getBusinessPhoneNumbersCheck.method).toBe('GET')
      expect(getBusinessPhoneNumbersCheck.path).toBe('/business-phone-numbers-check')
    })

    test('renders view with business phone numbers from state', () => {
      const request = {
        state: {
          tempBusinessTelephone: businessTelephone,
          tempBusinessMobile: businessMobile
        }
      }

      const h = createMockResponse()

      getBusinessPhoneNumbersCheck.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-phone-numbers-check', {
        businessTelephone,
        businessMobile
      })
    })

    test('renders view with empty strings when phone numbers are missing in state', () => {
      const request = { state: {} }
      const h = createMockResponse()

      getBusinessPhoneNumbersCheck.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-phone-numbers-check', {
        businessTelephone: '',
        businessMobile: ''
      })
    })
  })

  describe('POST /business-phone-numbers-check', () => {
    test('has correct method and path', () => {
      expect(postBusinessPhoneNumbersCheck.method).toBe('POST')
      expect(postBusinessPhoneNumbersCheck.path).toBe('/business-phone-numbers-check')
    })

    test('redirects to business-details with success banner and sets new phone numbers', () => {
      const request = {
        state: {
          tempBusinessTelephone: businessTelephone,
          tempBusinessMobile: businessMobile
        }
      }

      const h = createMockResponse()

      postBusinessPhoneNumbersCheck.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-details')
      expect(h.state).toHaveBeenCalledWith('showSuccessBanner', 'true')
      expect(h.state).toHaveBeenCalledWith('businessTelephone', businessTelephone)
      expect(h.state).toHaveBeenCalledWith('businessMobile', businessMobile)
      expect(h.unstate).toHaveBeenCalledWith('originalBusinessTelephone')
      expect(h.unstate).toHaveBeenCalledWith('originalBusinessMobile')
    })

    test('handles missing phone numbers in state without crashing', () => {
      const request = { state: {} }
      const h = createMockResponse()

      postBusinessPhoneNumbersCheck.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-details')
      expect(h.state).toHaveBeenCalledWith('showSuccessBanner', 'true')
      expect(h.state).toHaveBeenCalledWith('businessTelephone', undefined)
      expect(h.state).toHaveBeenCalledWith('businessMobile', undefined)
      expect(h.unstate).toHaveBeenCalledWith('originalBusinessTelephone')
      expect(h.unstate).toHaveBeenCalledWith('originalBusinessMobile')
    })
  })

  test('exports all routes', () => {
    expect(businessPhoneNumbersCheckRoutes).toEqual([
      getBusinessPhoneNumbersCheck,
      postBusinessPhoneNumbersCheck
    ])
  })
})
