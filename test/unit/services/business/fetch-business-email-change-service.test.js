// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { fetchBusinessEmailChangeService } from '../../../../src/services/business/fetch-business-email-change-service'
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service'

const businessEmail = 'business.email@test.com'
const changeBusinessEmail = 'change_business.email@test.com'

vi.mock('../../../../src/services/business/fetch-business-details-service', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

describe('fetchBusinessEmailChangeService', () => {
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
      businessEmail,
      changeBusinessEmail,
      singleBusinessIdentifier: '123456789',
      vatNumber: '',
      tradeNumber: '987654',
      vendorRegistrationNumber: '699368',
      countyParishHoldingNumber: '12/563/0998',
      businessLegalStatus: 'Sole proprietorship',
      businessType: 'Central or local government',
      userName: 'Alfred Waldron'
    }

    yar = {
      set: vi.fn().mockReturnValue(data),
      get: vi.fn().mockReturnValue(data)
    }
  })

  describe('when called', () => {
    test('it correctly returns the data', async () => {
      await fetchBusinessEmailChangeService(yar)
      expect(fetchBusinessDetailsService).toHaveBeenCalled(yar)
      expect(yar.get).toHaveBeenCalledWith('businessDetails')
    })
  })
})
