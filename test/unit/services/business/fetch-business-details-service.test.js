// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'

describe('fetchBusinessDetailsService', () => {
  let data
  let yar

  beforeEach(() => {
    vi.clearAllMocks()

    data = {
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

    // Mock yar session manager
    yar = {
      flash: vi.fn().mockReturnValue([{ title: 'Update', text: 'Business details updated successfully' }]),
      set: vi.fn().mockReturnValue(data),
      get: vi.fn().mockReturnValue(data)
    }
  })

  describe('when called', () => {
    test('it correctly returns the data', async () => {
      const result = await fetchBusinessDetailsService(yar)

      expect(result).toEqual({
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
      })
    })
  })
})
