import { describe, test, expect, jest } from '@jest/globals'
import {
  getBusinessDetails,
  businessDetailsRoutesView
} from '../../../../src/routes/business-details/business-details.js'

describe('Business Details Routes Unit Tests', () => {
  describe('GET /business-details', () => {
    const businessTelephone = '01234567890'
    const businessMobile = '09876543210'

    test('should have the correct method and path', () => {
      expect(getBusinessDetails.method).toBe('GET')
      expect(getBusinessDetails.path).toBe('/business-details')
    })

    test('should show success banner when showSuccessBanner is true', () => {
      const request = {
        state: {
          showSuccessBanner: 'true',
          businessName: 'Test Business',
          businessTelephone,
          businessMobile
        }
      }

      const stateMock = jest.fn().mockReturnThis()
      const unstateMock = jest.fn().mockReturnThis()

      const responseMock = {
        state: stateMock,
        unstate: unstateMock
      }

      const h = {
        view: jest.fn().mockReturnValue(responseMock)
      }

      getBusinessDetails.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-details', {
        showSuccessBanner: true,
        businessName: 'Test Business',
        formattedAddress: '10 Skirbeck Way<br>Maidstone<br>SK22 1DL<br>United Kingdom',
        businessTelephone: '01234567890',
        businessMobile: '09876543210',
        businessEmail: 'name@example.com'
      })

      expect(unstateMock).toHaveBeenCalledWith('showSuccessBanner')
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessName')
      expect(stateMock).toHaveBeenCalledWith('businessName', 'Test Business')
    })

    test('should use original business name when available and no success banner', () => {
      const request = {
        state: {
          showSuccessBanner: 'false',
          businessName: 'New Business Name',
          originalBusinessName: 'Original Business Name',
          businessTelephone,
          businessMobile,
          businessEmail: 'name@example.com'
        }
      }

      const stateMock = jest.fn().mockReturnThis()
      const unstateMock = jest.fn().mockReturnThis()

      const responseMock = {
        state: stateMock,
        unstate: unstateMock
      }

      const h = {
        view: jest.fn().mockReturnValue(responseMock)
      }

      getBusinessDetails.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-details', {
        showSuccessBanner: false,
        businessName: 'Original Business Name',
        formattedAddress: '10 Skirbeck Way<br>Maidstone<br>SK22 1DL<br>United Kingdom',
        businessTelephone: '01234567890',
        businessMobile: '09876543210',
        businessEmail: 'name@example.com'
      })

      expect(unstateMock).toHaveBeenCalledWith('showSuccessBanner')
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessName')
      expect(stateMock).toHaveBeenCalledWith('businessName', 'Original Business Name')
    })

    test('should not use original business name when success banner is present', () => {
      const request = {
        state: {
          showSuccessBanner: 'true',
          businessName: 'New Business Name',
          originalBusinessName: 'Original Business Name',
          businessTelephone,
          businessMobile,
          businessEmail: 'name@example.com'
        }
      }

      const stateMock = jest.fn().mockReturnThis()
      const unstateMock = jest.fn().mockReturnThis()

      const responseMock = {
        state: stateMock,
        unstate: unstateMock
      }

      const h = {
        view: jest.fn().mockReturnValue(responseMock)
      }

      getBusinessDetails.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-details', {
        showSuccessBanner: true,
        businessName: 'New Business Name',
        formattedAddress: '10 Skirbeck Way<br>Maidstone<br>SK22 1DL<br>United Kingdom',
        businessTelephone: '01234567890',
        businessMobile: '09876543210',
        businessEmail: 'name@example.com'
      })

      expect(unstateMock).toHaveBeenCalledWith('showSuccessBanner')
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessName')
      expect(stateMock).toHaveBeenCalledWith('businessName', 'New Business Name')
    })

    test('should use default business name when no name is provided', () => {
      const request = {
        state: {
          businessTelephone,
          businessMobile
        }
      }

      const stateMock = jest.fn().mockReturnThis()
      const unstateMock = jest.fn().mockReturnThis()

      const responseMock = {
        state: stateMock,
        unstate: unstateMock
      }

      const h = {
        view: jest.fn().mockReturnValue(responseMock)
      }

      getBusinessDetails.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-details', {
        showSuccessBanner: false,
        businessName: 'Agile Farm Ltd',
        formattedAddress: '10 Skirbeck Way<br>Maidstone<br>SK22 1DL<br>United Kingdom',
        businessTelephone: '01234567890',
        businessMobile: '09876543210',
        businessEmail: 'name@example.com'
      })

      expect(unstateMock).toHaveBeenCalledWith('showSuccessBanner')
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessName')
      expect(stateMock).toHaveBeenCalledWith('businessName', 'Agile Farm Ltd')
    })

    test('should unstate temp values when they exist and showSuccessBanner is false', () => {
      const request = {
        state: {
          showSuccessBanner: 'false',
          businessName: 'Test Business',
          businessTelephone,
          businessMobile,
          tempBusinessTelephone: '01230000000',
          tempBusinessMobile: '09870000000'
        }
      }

      const stateMock = jest.fn().mockReturnThis()
      const unstateMock = jest.fn().mockReturnThis()

      const responseMock = {
        state: stateMock,
        unstate: unstateMock
      }

      const h = {
        view: jest.fn().mockReturnValue(responseMock)
      }

      getBusinessDetails.handler(request, h)

      expect(unstateMock).toHaveBeenCalledWith('tempBusinessTelephone')
      expect(unstateMock).toHaveBeenCalledWith('tempBusinessMobile')
    })
  })

  test('should export all routes', () => {
    expect(businessDetailsRoutesView).toEqual([
      getBusinessDetails
    ])
  })
})
