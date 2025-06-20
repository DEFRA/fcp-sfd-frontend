// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'

describe('fetchBusinessDetailsService', () => {
  let yar

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when sessionData is null', () => {
    beforeEach(() => {
      yar = {
        get: vi.fn().mockReturnValue(null)
      }
    })

    test('it correctly returns the mock data', async () => {
      const result = await fetchBusinessDetailsService(yar)

      expect(result).toEqual(getMockData())
    })
  })

  describe('when businessDetailsUpdated is true', () => {
    beforeEach(() => {
      yar = {
        get: vi.fn().mockReturnValue(getSessionData(true))
      }
    })

    test('it correctly returns the mock data', async () => {
      const result = await fetchBusinessDetailsService(yar)

      expect(result).toEqual(getMockData())
    })
  })

  describe('when businessDetailsUpdated is false', () => {
    beforeEach(() => {
      yar = {
        get: vi.fn().mockReturnValue(getSessionData(false))
      }
    })

    test('it correctly returns the session data', async () => {
      const result = await fetchBusinessDetailsService(yar)

      expect(result).toEqual(getSessionData(false))
    })
  })
})

const getSessionData = (businessDetailsUpdated) => {
  return {
    businessName: 'Other farm name',
    businessAddress: {
      address1: 'Other address name',
      address2: '',
      city: 'Maidstone',
      county: '',
      postcode: 'SK22 1DL',
      country: 'United Kingdom'
    },
    businessTelephone: '01234567890',
    businessMobile: '01234567890',
    businessEmail: 'a.farmer@farms.com',
    sbi: '123456789',
    vatNumber: '',
    tradeNumber: '987654',
    vendorRegistrationNumber: '699368',
    countyParishHoldingNumber: '12/563/0998',
    businessLegalStatus: 'Sole proprietorship',
    businessType: 'Central or local government',
    userName: 'Other user name',
    businessDetailsUpdated
  }
}

const getMockData = () => {
  return {
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
    sbi: '123456789',
    vatNumber: '',
    tradeNumber: '987654',
    vendorRegistrationNumber: '699368',
    countyParishHoldingNumber: '12/563/0998',
    businessLegalStatus: 'Sole proprietorship',
    businessType: 'Central or local government',
    userName: 'Alfred Waldron'
  }
}
