import { describe, test, expect, vi } from 'vitest'
import { getBusinessDetails } from '../../../../src/routes/business-details/business-details.js'

describe('Business Details Routes Unit Tests', () => {
  const defauViewData = {
    showSuccessBanner: true,
    successMessage: null,
    businessName: 'Test Business',
    formattedAddress: '10 Skirbeck Way<br>Maidstone<br>SK22 1DL<br>United Kingdom',
    businessTelephone: '01234567890',
    businessMobile: '09876543210',
    businessEmail: 'name@example.com'
  }

  const createMockResponse = () => {
    const stateMock = vi.fn().mockReturnThis()
    const unstateMock = vi.fn().mockReturnThis()

    return {
      h: {
        view: vi.fn().mockReturnValue({
          state: stateMock,
          unstate: unstateMock
        })
      },
      stateMock,
      unstateMock
    }
  }

  describe('GET /business-details', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessDetails.method).toBe('GET')
      expect(getBusinessDetails.path).toBe('/business-details')
    })

    test('should show success banner when showSuccessBanner is true', () => {
      const request = {
        state: {
          showSuccessBanner: 'true',
          businessName: 'Test Business',
          businessTelephone: '01234567890',
          businessMobile: '09876543210'
        }
      }

      const { h, stateMock, unstateMock } = createMockResponse()

      getBusinessDetails.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-details', {
        ...defauViewData
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
          businessTelephone: '01234567890',
          businessMobile: '09876543210',
          businessEmail: 'name@example.com'
        }
      }

      const { h, stateMock, unstateMock } = createMockResponse()

      getBusinessDetails.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-details', {
        ...defauViewData,
        showSuccessBanner: false,
        businessName: 'Original Business Name'
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
          businessTelephone: '01234567890',
          businessMobile: '09876543210',
          businessEmail: 'name@example.com'
        }
      }

      const { h, stateMock, unstateMock } = createMockResponse()

      getBusinessDetails.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-details', {
        ...defauViewData,
        businessName: 'New Business Name'
      })

      expect(unstateMock).toHaveBeenCalledWith('showSuccessBanner')
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessName')
      expect(stateMock).toHaveBeenCalledWith('businessName', 'New Business Name')
    })

    test('should use default business name when no name is provided', () => {
      const request = {
        state: {
          businessTelephone: '01234567890',
          businessMobile: '09876543210'
        }
      }

      const { h, stateMock, unstateMock } = createMockResponse()

      getBusinessDetails.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business-details/business-details', {
        ...defauViewData,
        showSuccessBanner: false,
        businessName: 'Agile Farm Ltd'
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
          businessTelephone: '01234567890',
          businessMobile: '09876543210',
          tempBusinessTelephone: '01230000000',
          tempBusinessMobile: '09870000000'
        }
      }

      const { h, unstateMock } = createMockResponse()

      getBusinessDetails.handler(request, h)

      expect(unstateMock).toHaveBeenCalledWith('tempBusinessTelephone')
      expect(unstateMock).toHaveBeenCalledWith('tempBusinessMobile')
    })
  })
})
