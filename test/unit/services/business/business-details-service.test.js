// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details.service.js'

// Thing under test
import { businessDetailsService } from '../../../../src/services/business/business-details.service.js'

// Mock
vi.mock('../../../../src/services/business/fetch-business-details.service.js', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

describe('businessDetailsService', () => {
  const request = {}

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when called', () => {
    beforeEach(() => {
      const mockData = {
        businessName: 'Agile Farm Ltd',
        businessAddress: {
          address1: '10 Skirbeck Way',
          address2: '',
          city: 'Maidstone',
          county: '',
          postcode: 'SK22 1DL',
          country: 'United Kingdom'
        },
        businessTelephone: '01234567890',
        businessMobile: '01234567890',
        businessEmail: 'a.farmer@farms.com',
        singleBusinessIdentifier: '123456789',
        vatNumber: '',
        tradeNumber: '987654',
        vendorRegistrationNumber: '699368',
        countyParishHoldingNumber: '12/563/0998',
        businessLegalStatus: 'Sole proprietorship',
        businessType: 'Central or local government',
        userName: 'Alfred Waldron'
      }

      fetchBusinessDetailsService.mockResolvedValue(mockData)

      // Mock yar session manager
      request.yar = {
        flash: vi.fn().mockReturnValue([{}])
      }
    })

    test('it fetches the business details data', async () => {
      await businessDetailsService(request)

      expect(fetchBusinessDetailsService).toHaveBeenCalled()
    })

    test('returns the page data for the view', async () => {
      const result = await businessDetailsService(request)

      expect(result).toEqual({
        notification: {},
        pageTitle: 'View and update your business details',
        metaDescription: 'View and change the details for your business.',
        address: ['10 Skirbeck Way', 'Maidstone', 'SK22 1DL', 'United Kingdom'],
        businessName: 'Agile Farm Ltd',
        businessTelephone: '01234567890',
        businessMobile: '01234567890',
        businessEmail: 'a.farmer@farms.com',
        singleBusinessIdentifier: '123456789',
        vatNumber: '',
        tradeNumber: '987654',
        vendorRegistrationNumber: '699368',
        countyParishHoldingNumber: '12/563/0998',
        businessLegalStatus: 'Sole proprietorship',
        businessType: 'Central or local government',
        userName: 'Alfred Waldron'
      })
    })
  })
})
