import { describe, test, expect, vi } from 'vitest'
import { getBusinessDetails } from '../../../../src/routes/business/business-details.routes.js'

const defaultViewData = {
  showSuccessBanner: true,
  successMessage: null,
  businessName: 'Test Business',
  formattedAddress: '10 Skirbeck Way<br>Maidstone<br>SK22 1DL<br>United Kingdom',
  businessTelephone: '01234567890',
  businessMobile: '09876543210',
  businessEmail: 'name@example.com'
}

const createMockContext = () => {
  const stateMock = vi.fn().mockReturnThis()
  const unstateMock = vi.fn().mockReturnThis()

  const h = {
    view: vi.fn().mockReturnValue({
      state: stateMock,
      unstate: unstateMock
    })
  }

  return {
    h,
    stateMock,
    unstateMock
  }
}

const getRequest = (overrides = {}) => ({
  state: {
    showSuccessBanner: 'false',
    businessName: 'Test Business',
    businessTelephone: '01234567890',
    businessMobile: '09876543210',
    ...overrides
  }
})

describe('business details', () => {
  describe('GET /business-details', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessDetails.method).toBe('GET')
      expect(getBusinessDetails.path).toBe('/business-details')
    })

    test('should show success banner when showSuccessBanner is true', () => {
      const request = getRequest({ showSuccessBanner: 'true' })

      const {
        h,
        stateMock,
        unstateMock
      } = createMockContext()

      getBusinessDetails.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business/business-details', defaultViewData)
      expect(unstateMock).toHaveBeenCalledWith('showSuccessBanner')
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessName')
      expect(stateMock).toHaveBeenCalledWith('businessName', 'Test Business')
    })

    test('should use original business name when available and no success banner', () => {
      const request = getRequest({
        originalBusinessName: 'Original Business Name',
        businessName: 'New Business Name',
        businessEmail: 'name@example.com'
      })

      const { h, stateMock, unstateMock } = createMockContext()

      getBusinessDetails.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business/business-details', {
        ...defaultViewData,
        showSuccessBanner: false,
        businessName: 'Original Business Name'
      })

      expect(stateMock).toHaveBeenCalledWith('businessName', 'Original Business Name')
      expect(unstateMock).toHaveBeenCalledWith('showSuccessBanner')
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessName')
    })

    test('should not use original business name when success banner is present', () => {
      const request = getRequest({
        showSuccessBanner: 'true',
        originalBusinessName: 'Original Business Name',
        businessName: 'New Business Name',
        businessEmail: 'name@example.com'
      })

      const { h, stateMock, unstateMock } = createMockContext()

      getBusinessDetails.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business/business-details', {
        ...defaultViewData,
        businessName: 'New Business Name'
      })

      expect(stateMock).toHaveBeenCalledWith('businessName', 'New Business Name')
      expect(unstateMock).toHaveBeenCalledWith('showSuccessBanner')
      expect(unstateMock).toHaveBeenCalledWith('originalBusinessName')
    })

    test('should use default business name when no name is provided', () => {
      const request = getRequest({ businessName: undefined })
      const { h, stateMock } = createMockContext()

      getBusinessDetails.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business/business-details', {
        ...defaultViewData,
        showSuccessBanner: false,
        businessName: 'Agile Farm Ltd'
      })

      expect(stateMock).toHaveBeenCalledWith('businessName', 'Agile Farm Ltd')
    })

    test('should unstate temp values when they exist and showSuccessBanner is false', () => {
      const request = getRequest({
        tempBusinessTelephone: '01230000000',
        tempBusinessMobile: '09870000000'
      })

      const { h, unstateMock } = createMockContext()

      getBusinessDetails.handler(request, h)

      expect(unstateMock).toHaveBeenCalledWith('tempBusinessTelephone')
      expect(unstateMock).toHaveBeenCalledWith('tempBusinessMobile')
    })
  })
})
