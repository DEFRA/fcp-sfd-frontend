import { describe, test, expect, jest } from '@jest/globals'
import {
  getBusinessDetails,
  businessDetailsRoutesView
} from '../../../../src/routes/business-details/business-details.js'

describe('Business Details Routes Unit Tests', () => {
  describe('GET /business-details', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessDetails.method).toBe('GET')
      expect(getBusinessDetails.path).toBe('/business-details')
    })

    test('should show success banner when showSuccessBanner is true', () => {
      const request = {
        state: {
          showSuccessBanner: 'true',
          businessName: 'Test Business'
        }
      }

      const stateMock = jest.fn().mockReturnThis()
      const secondUnstate = jest.fn().mockReturnValue({
        state: stateMock
      })
      const firstUnstate = jest.fn().mockReturnValue({
        unstate: secondUnstate
      })

      const h = {
        view: jest.fn().mockReturnValue({
          unstate: firstUnstate
        })
      }

      getBusinessDetails.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-details', {
        showSuccessBanner: true,
        businessName: 'Test Business',
        formattedAddress: '10 Skirbeck Way<br>Maidstone<br>SK22 1DL<br>United Kingdom'
      })
      expect(firstUnstate).toHaveBeenCalledWith('showSuccessBanner')
      expect(secondUnstate).toHaveBeenCalledWith('originalBusinessName')
      expect(stateMock).toHaveBeenCalledWith('businessName', 'Test Business')
    })

    test('should use original business name when available and no success banner', () => {
      const request = {
        state: {
          showSuccessBanner: 'false',
          businessName: 'New Business Name',
          originalBusinessName: 'Original Business Name'
        }
      }

      const stateMock = jest.fn().mockReturnThis()
      const secondUnstate = jest.fn().mockReturnValue({
        state: stateMock
      })
      const firstUnstate = jest.fn().mockReturnValue({
        unstate: secondUnstate
      })

      const h = {
        view: jest.fn().mockReturnValue({
          unstate: firstUnstate
        })
      }

      getBusinessDetails.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-details', {
        showSuccessBanner: false,
        businessName: 'Original Business Name',
        formattedAddress: '10 Skirbeck Way<br>Maidstone<br>SK22 1DL<br>United Kingdom'
      })
      expect(firstUnstate).toHaveBeenCalledWith('showSuccessBanner')
      expect(secondUnstate).toHaveBeenCalledWith('originalBusinessName')
      expect(stateMock).toHaveBeenCalledWith('businessName', 'Original Business Name')
    })

    test('should not use original business name when success banner is present', () => {
      const request = {
        state: {
          showSuccessBanner: 'true',
          businessName: 'New Business Name',
          originalBusinessName: 'Original Business Name'
        }
      }

      const stateMock = jest.fn().mockReturnThis()
      const secondUnstate = jest.fn().mockReturnValue({
        state: stateMock
      })
      const firstUnstate = jest.fn().mockReturnValue({
        unstate: secondUnstate
      })

      const h = {
        view: jest.fn().mockReturnValue({
          unstate: firstUnstate
        })
      }

      getBusinessDetails.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-details', {
        showSuccessBanner: true,
        businessName: 'New Business Name',
        formattedAddress: '10 Skirbeck Way<br>Maidstone<br>SK22 1DL<br>United Kingdom'
      })
      expect(firstUnstate).toHaveBeenCalledWith('showSuccessBanner')
      expect(secondUnstate).toHaveBeenCalledWith('originalBusinessName')
      expect(stateMock).toHaveBeenCalledWith('businessName', 'New Business Name')
    })

    test('should use default business name when no name is provided', () => {
      const request = {
        state: {}
      }

      const stateMock = jest.fn().mockReturnThis()
      const secondUnstate = jest.fn().mockReturnValue({
        state: stateMock
      })
      const firstUnstate = jest.fn().mockReturnValue({
        unstate: secondUnstate
      })

      const h = {
        view: jest.fn().mockReturnValue({
          unstate: firstUnstate
        })
      }

      getBusinessDetails.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-details', {
        showSuccessBanner: false,
        businessName: 'Agile Farm Ltd',
        formattedAddress: '10 Skirbeck Way<br>Maidstone<br>SK22 1DL<br>United Kingdom'
      })
      expect(firstUnstate).toHaveBeenCalledWith('showSuccessBanner')
      expect(secondUnstate).toHaveBeenCalledWith('originalBusinessName')
      expect(stateMock).toHaveBeenCalledWith('businessName', 'Agile Farm Ltd')
    })
  })

  test('should export all routes', () => {
    expect(businessDetailsRoutesView).toEqual([
      getBusinessDetails
    ])
  })
})
