// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { businessDetailsPresenter } from '../../../../src/presenters/business/business-details-presenter.js'

describe('businessDetailsPresenter', () => {
  let data
  let yar

  beforeEach(() => {
    vi.clearAllMocks()

    data = {
      businessName: 'Agile Farm Ltd',
      businessAddress: {
        address1: '10 Skirbeck Way',
        address2: 'Lonely Lane',
        city: 'Maidstone',
        county: 'Somerset',
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

    // Mock yar session manager
    yar = {
      flash: vi.fn().mockReturnValue([{ title: 'Update', text: 'Business details updated successfully' }])
    }
  })

  describe('when provided with business details data', () => {
    test('it correctly presents the data', () => {
      const result = businessDetailsPresenter(data, yar)

      expect(result).toEqual({
        notification: { title: 'Update', text: 'Business details updated successfully' },
        pageTitle: 'View and update your business details',
        metaDescription: 'View and change the details for your business.',
        address: ['10 Skirbeck Way', 'Lonely Lane', 'Maidstone', 'Somerset', 'SK22 1DL', 'United Kingdom'],
        businessName: 'Agile Farm Ltd',
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
      })
    })
  })

  describe('the "address" property', () => {
    describe('when the address has missing fields', () => {
      beforeEach(() => {
        data.businessAddress = {
          address1: '10 Skirbeck Way',
          address2: 'Lonely Lane',
          city: '',
          county: 'Somerset',
          postcode: 'SK22 1DL',
          country: ''
        }
      })

      test('it should remove them and return the address as an array', () => {
        const result = businessDetailsPresenter(data, yar)

        expect(result.address).toEqual(['10 Skirbeck Way', 'Lonely Lane', 'Somerset', 'SK22 1DL'])
      })
    })
  })

  describe('the "businessTelephone" property', () => {
    describe('when the businessAddress property is missing', () => {
      beforeEach(() => {
        data.businessTelephone = null
      })

      test('it should return the text "Not added', () => {
        const result = businessDetailsPresenter(data, yar)

        expect(result.businessTelephone).toEqual('Not added')
      })
    })
  })

  describe('the "businessMobile" property', () => {
    describe('when the businessMobile property is missing', () => {
      beforeEach(() => {
        data.businessMobile = null
      })

      test('it should return the text "Not added', () => {
        const result = businessDetailsPresenter(data, yar)

        expect(result.businessMobile).toEqual('Not added')
      })
    })
  })
})
