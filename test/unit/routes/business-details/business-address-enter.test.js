import { describe, test, expect, vi } from 'vitest'
import {
  defaultAddress,
  testAddress,
  newAddress,
  emptyAddress
} from '../../constants/test-addresses.js'
import { businessAddressRoutes } from '../../../../src/routes/business-details/business-address-enter.js'

const [getBusinessAddressEnter, postBusinessAddressEnter] = businessAddressRoutes

vi.mock('../../../../src/schemas/business-details/business-address.js', () => ({
  businessAddressSchema: {
    validate: vi.fn()
  }
}))

const viewPath = 'business-details/business-address-form'

const createViewHandler = () => {
  const state = vi.fn().mockReturnThis()

  return {
    view: vi.fn().mockReturnValue({ state }),
    state
  }
}

const createRedirectHandler = () => {
  const state = vi.fn().mockReturnThis()
  const unstate = vi.fn().mockReturnThis()

  return {
    redirect: vi.fn().mockReturnValue({ state, unstate }),
    state,
    unstate
  }
}

describe('enter business address', () => {
  describe('GET /business-address-enter', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessAddressEnter.method).toBe('GET')
      expect(getBusinessAddressEnter.path).toBe('/business-address-enter')
    })

    test.each([
      ['with test address in state', testAddress, testAddress],
      ['with empty state', {}, defaultAddress]
    ])('should render view %s', (_, stateMock, expectedAddress) => {
      const request = { state: stateMock }
      const { view, state } = createViewHandler()

      getBusinessAddressEnter.handler(request, { view })

      expect(view).toHaveBeenCalledWith(viewPath, expectedAddress)
      expect(state).toHaveBeenCalledWith('originalAddress', JSON.stringify(expectedAddress))
    })
  })

  describe('POST /business-address-enter', () => {
    test('should have the correct method and path', () => {
      expect(postBusinessAddressEnter.method).toBe('POST')
      expect(postBusinessAddressEnter.path).toBe('/business-address-enter')
    })

    test('should handle validation failure with detailed errors', async () => {
      const request = { payload: emptyAddress }

      const h = {
        view: vi.fn().mockReturnThis(),
        code: vi.fn().mockReturnThis(),
        takeover: vi.fn().mockReturnThis()
      }

      const err = {
        details: [
          { path: ['address1'], message: 'Enter address line 1, typically the building and street' },
          { path: ['addressCity'], message: 'Enter town or city' },
          { path: ['addressCountry'], message: 'Enter a country' }
        ]
      }

      await postBusinessAddressEnter.options.validate.failAction(request, h, err)

      expect(h.view).toHaveBeenCalledWith(viewPath, {
        ...emptyAddress,
        errors: {
          address1: { text: err.details[0].message },
          addressCity: { text: err.details[1].message },
          addressCountry: { text: err.details[2].message }
        }
      })

      expect(h.code).toHaveBeenCalledWith(400)
      expect(h.takeover).toHaveBeenCalled()
    })

    test('should handle validation failure with no error details', async () => {
      const request = { payload: emptyAddress }

      const h = {
        view: vi.fn().mockReturnThis(),
        code: vi.fn().mockReturnThis(),
        takeover: vi.fn().mockReturnThis()
      }

      const err = {}

      await postBusinessAddressEnter.options.validate.failAction(request, h, err)

      expect(h.view).toHaveBeenCalledWith(viewPath, {
        ...emptyAddress,
        errors: {}
      })

      expect(h.code).toHaveBeenCalledWith(400)
      expect(h.takeover).toHaveBeenCalled()
    })

    test('should redirect to check page on successful submission', () => {
      const request = { payload: newAddress }
      const { redirect, state, unstate } = createRedirectHandler()

      postBusinessAddressEnter.options.handler(request, { redirect })

      expect(redirect).toHaveBeenCalledWith('/business-address-check')
      expect(unstate).toHaveBeenCalledWith('originalAddress')

      for (const [key, value] of Object.entries(newAddress)) {
        expect(state).toHaveBeenCalledWith(key, value)
      }
    })
  })

  test('should export all routes', () => {
    expect(businessAddressRoutes).toEqual([
      getBusinessAddressEnter,
      postBusinessAddressEnter
    ])
  })
})
