import { describe, test, expect, vi } from 'vitest'
import {
  getBusinessAddressCheck,
  postBusinessAddressCheck,
  businessAddressCheckRoutes
} from '../../../../src/routes/business-details/business-address-check'
import { testAddress, defaultAddress, emptyAddress, newAddress } from '../../constants/test-addresses'

describe('Business Address Check Routes Unit Tests', () => {
  describe('GET /business-address-check', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessAddressCheck.method).toBe('GET')
      expect(getBusinessAddressCheck.path).toBe('/business-address-check')
    })

    test('should render the correct view with address values from state', () => {
      const request = {
        state: testAddress
      }

      const h = {
        view: vi.fn().mockReturnThis()
      }

      getBusinessAddressCheck.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-address-check', testAddress)
    })

    test('should render the correct view with empty strings when no address in state', () => {
      const request = {
        state: {}
      }

      const h = {
        view: vi.fn().mockReturnThis()
      }

      getBusinessAddressCheck.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-address-check', emptyAddress)
    })

    test('should handle partial state values correctly', () => {
      const partialAddress = {
        address1: defaultAddress.address1,
        addressPostcode: defaultAddress.addressPostcode
      }

      const request = {
        state: partialAddress
      }

      const h = {
        view: vi.fn().mockReturnThis()
      }

      getBusinessAddressCheck.handler(request, h)

      const expectedResult = {
        ...emptyAddress,
        address1: defaultAddress.address1,
        addressPostcode: defaultAddress.addressPostcode
      }

      expect(h.view).toHaveBeenCalledWith('business-details/business-address-check', expectedResult)
    })
  })

  describe('POST /business-address-check', () => {
    test('should have the correct method and path', () => {
      expect(postBusinessAddressCheck.method).toBe('POST')
      expect(postBusinessAddressCheck.path).toBe('/business-address-check')
    })

    test('should redirect to business-details with success banner and address state', () => {
      const request = {
        state: newAddress
      }

      const stateMock = vi.fn().mockReturnThis()
      const unstateMock = vi.fn().mockReturnThis()

      const h = {
        redirect: vi.fn().mockReturnValue({
          state: stateMock,
          unstate: unstateMock
        })
      }

      postBusinessAddressCheck.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-details')
      expect(stateMock).toHaveBeenCalledWith('showSuccessBanner', 'true')
      expect(stateMock).toHaveBeenCalledWith('address1', newAddress.address1)
      expect(stateMock).toHaveBeenCalledWith('address2', newAddress.address2)
      expect(stateMock).toHaveBeenCalledWith('addressCity', newAddress.addressCity)
      expect(stateMock).toHaveBeenCalledWith('addressCounty', newAddress.addressCounty)
      expect(stateMock).toHaveBeenCalledWith('addressPostcode', newAddress.addressPostcode)
      expect(stateMock).toHaveBeenCalledWith('addressCountry', newAddress.addressCountry)
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessName')
    })

    test('should handle empty state values', () => {
      const request = {
        state: {}
      }

      const stateMock = vi.fn().mockReturnThis()
      const unstateMock = vi.fn().mockReturnThis()

      const h = {
        redirect: vi.fn().mockReturnValue({
          state: stateMock,
          unstate: unstateMock
        })
      }

      postBusinessAddressCheck.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-details')
      expect(stateMock).toHaveBeenCalledWith('showSuccessBanner', 'true')
      Object.entries(emptyAddress).forEach(([key, value]) => {
        expect(stateMock).toHaveBeenCalledWith(key, value)
      })
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessName')
    })

    test('should handle partial state values', () => {
      const partialAddress = {
        address1: defaultAddress.address1,
        addressPostcode: defaultAddress.addressPostcode
      }

      const request = {
        state: partialAddress
      }

      const stateMock = vi.fn().mockReturnThis()
      const unstateMock = vi.fn().mockReturnThis()

      const h = {
        redirect: vi.fn().mockReturnValue({
          state: stateMock,
          unstate: unstateMock
        })
      }

      postBusinessAddressCheck.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-details')
      expect(stateMock).toHaveBeenCalledWith('showSuccessBanner', 'true')

      const expectedValues = {
        ...emptyAddress,
        address1: defaultAddress.address1,
        addressPostcode: defaultAddress.addressPostcode
      }

      Object.entries(expectedValues).forEach(([key, value]) => {
        expect(stateMock).toHaveBeenCalledWith(key, value)
      })

      expect(unstateMock).toHaveBeenCalledWith('originalBusinessName')
    })
  })

  test('should export all routes', () => {
    expect(businessAddressCheckRoutes).toEqual([
      getBusinessAddressCheck,
      postBusinessAddressCheck
    ])
  })
})
