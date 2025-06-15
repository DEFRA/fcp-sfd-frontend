// Test framework dependencies
import { describe, test, expect } from 'vitest'

// Thing under test
import { fetchBusinessAddressService } from '../../../../src/services/business/fetch-business-address-service.js'

describe('fetchBusinessAddressService', () => {
  describe('when called', () => {
    test('it correctly returns the data', async () => {
      const result = await fetchBusinessAddressService()

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
        singleBusinessIdentifier: '123456789',
        userName: 'Alfred Waldron'
      })
    })
  })
})
