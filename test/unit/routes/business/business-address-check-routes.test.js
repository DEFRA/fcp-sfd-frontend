import { describe, test, expect, vi } from 'vitest'
import {
  testAddress,
  defaultAddress,
  emptyAddress,
  newAddress
} from '../../constants/test-addresses.js'
import { businessAddressCheckRoutes } from '../../../../src/routes/business/business-address-check-routes.js'

const [
  getBusinessAddressCheck, postBusinessAddressCheck] = businessAddressCheckRoutes

const createViewHandler = () => ({
  view: vi.fn().mockReturnThis()
})

describe('check business address', () => {
  describe('GET /business-address-check', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessAddressCheck.method).toBe('GET')
      expect(getBusinessAddressCheck.path).toBe('/business-address-check')
    })

    test.each([
      ['full address from state', testAddress, { ...testAddress }],
      ['empty address from state', {}, { ...emptyAddress }],
      [
        'partial address from state',
        {
          address1: defaultAddress.address1,
          addressPostcode: defaultAddress.addressPostcode
        },
        {
          ...emptyAddress,
          address1: defaultAddress.address1,
          addressPostcode: defaultAddress.addressPostcode
        }
      ]
    ])('should render view with %s', (_, stateMock, expectedAddress) => {
      const h = createViewHandler()
      const request = { state: stateMock }

      getBusinessAddressCheck.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business/business-address-check', expectedAddress)
    })
  })

  describe('POST /business-address-check', () => {
    test('should have the correct method and path', () => {
      expect(postBusinessAddressCheck.method).toBe('POST')
      expect(postBusinessAddressCheck.path).toBe('/business-address-check')
    })

    test.each([
      ['new address from state', newAddress, { ...newAddress }],
      ['empty address from state', {}, { ...emptyAddress }],
      [
        'partial address from state',
        {
          address1: defaultAddress.address1,
          addressPostcode: defaultAddress.addressPostcode
        },
        {
          ...emptyAddress,
          address1: defaultAddress.address1,
          addressPostcode: defaultAddress.addressPostcode
        }
      ]
    ])('should redirect with %s', (_, stateMock, expectedAddress) => {
      const request = { state: stateMock }
      const state = vi.fn().mockReturnThis()
      const unstate = vi.fn().mockReturnThis()

      const h = {
        redirect: vi.fn().mockReturnValue({ state, unstate })
      }

      postBusinessAddressCheck.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-details')
      expect(state).toHaveBeenCalledWith('showSuccessBanner', 'true')

      for (const [key, value] of Object.entries(expectedAddress)) {
        expect(state).toHaveBeenCalledWith(key, value)
      }

      expect(unstate).toHaveBeenCalledWith('originalBusinessName')
    })
  })

  test('should export all routes', () => {
    expect(businessAddressCheckRoutes).toEqual([
      getBusinessAddressCheck,
      postBusinessAddressCheck
    ])
  })
})
