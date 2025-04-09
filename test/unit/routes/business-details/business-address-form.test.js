import { describe, test, expect, jest } from '@jest/globals'
import {
  getBusinessAddressEnter,
  postBusinessAddressEnter,
  businessAddressRoutes
} from '../../../../src/routes/business-details/business-address-form.js'
import { defaultAddress, testAddress, newAddress } from '../../constants/test-addresses.js'

// Mock the schema to avoid importing the real validation schema
jest.mock('../../../../src/schemas/business-details/business-address-form.js', () => ({
  businessAddressSchema: {
    validate: jest.fn()
  }
}))

describe('Business Address Routes Unit Tests', () => {
  describe('GET /business-address-enter', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessAddressEnter.method).toBe('GET')
      expect(getBusinessAddressEnter.path).toBe('/business-address-enter')
    })

    test('should render the correct view with address data from state', () => {
      const request = {
        state: { ...testAddress }
      }

      const stateMock = jest.fn().mockReturnThis()

      const h = {
        view: jest.fn().mockReturnValue({
          state: stateMock
        })
      }

      getBusinessAddressEnter.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-address-form', testAddress)
      expect(stateMock).toHaveBeenCalledWith('originalAddress', JSON.stringify(testAddress))
    })

    test('should use default values when state does not contain address data', () => {
      const request = {
        state: {}
      }

      const stateMock = jest.fn().mockReturnThis()

      const h = {
        view: jest.fn().mockReturnValue({
          state: stateMock
        })
      }

      getBusinessAddressEnter.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-address-form', defaultAddress)
      expect(stateMock).toHaveBeenCalledWith('originalAddress', JSON.stringify(defaultAddress))
    })
  })

  describe('POST /business-address-enter', () => {
    test('should have the correct method and path', () => {
      expect(postBusinessAddressEnter.method).toBe('POST')
      expect(postBusinessAddressEnter.path).toBe('/business-address-enter')
    })

    test('should handle validation failures correctly', async () => {
      const request = {
        payload: {
          address1: '',
          address2: '',
          addressCity: '',
          addressCounty: '',
          addressPostcode: '',
          addressCountry: ''
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
            path: ['address1'],
            message: 'Enter address line 1, typically the building and street'
          },
          {
            path: ['addressCity'],
            message: 'Enter town or city'
          },
          {
            path: ['addressCountry'],
            message: 'Enter a country'
          }
        ]
      }

      await postBusinessAddressEnter.options.validate.failAction(request, h, err)

      expect(h.view).toHaveBeenCalledWith('business-details/business-address-form', {
        address1: '',
        address2: '',
        addressCity: '',
        addressCounty: '',
        addressPostcode: '',
        addressCountry: '',
        errors: {
          address1: {
            text: 'Enter address line 1, typically the building and street'
          },
          addressCity: {
            text: 'Enter town or city'
          },
          addressCountry: {
            text: 'Enter a country'
          }
        }
      })

      expect(h.code).toHaveBeenCalledWith(400)
      expect(h.takeover).toHaveBeenCalled()
    })

    test('should redirect to check page on successful submission with all state values', () => {
      const request = {
        payload: { ...newAddress }
      }

      const unstateMock = jest.fn().mockReturnThis()
      const sixthState = jest.fn().mockReturnValue({
        unstate: unstateMock
      })
      const fifthState = jest.fn().mockReturnValue({
        state: sixthState
      })
      const fourthState = jest.fn().mockReturnValue({
        state: fifthState
      })
      const thirdState = jest.fn().mockReturnValue({
        state: fourthState
      })
      const secondState = jest.fn().mockReturnValue({
        state: thirdState
      })
      const firstState = jest.fn().mockReturnValue({
        state: secondState
      })

      const h = {
        redirect: jest.fn().mockReturnValue({
          state: firstState
        })
      }

      postBusinessAddressEnter.options.handler(request, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-address-check')
      expect(firstState).toHaveBeenCalledWith('address1', newAddress.address1)
      expect(secondState).toHaveBeenCalledWith('address2', newAddress.address2)
      expect(thirdState).toHaveBeenCalledWith('addressCity', newAddress.addressCity)
      expect(fourthState).toHaveBeenCalledWith('addressCounty', newAddress.addressCounty)
      expect(fifthState).toHaveBeenCalledWith('addressPostcode', newAddress.addressPostcode)
      expect(sixthState).toHaveBeenCalledWith('addressCountry', newAddress.addressCountry)
      expect(unstateMock).toHaveBeenCalledWith('originalAddress')
    })
  })

  test('should export all routes', () => {
    expect(businessAddressRoutes).toEqual([
      getBusinessAddressEnter,
      postBusinessAddressEnter
    ])
  })
})
