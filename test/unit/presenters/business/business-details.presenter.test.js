// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessDetailsPresenter } from '../../../../src/presenters/business/business-details.presenter.js'

describe('businessDetailsPresenter', () => {
  let data

  describe('when provided with business details data', () => {
    beforeEach(() => {
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
        singleBusinessIdentifier: '123456789',
        vatNumber: '',
        tradeNumber: '987654',
        vendorRegistrationNumber: '699368',
        countyParishHoldingNumber: '12/563/0998',
        businessLegalStatus: 'Sole proprietorship',
        businessType: 'Central or local government',
        userName: 'Alfred Waldron'
      }
    })

    test('it correctly presents the data', () => {
      const result = businessDetailsPresenter(data)

      expect(result).toEqual({
        pageTitle: 'View and update your business details',
        metaDescription: 'View and change the details for your business.',
        address: ['10 Skirbeck Way', 'Lonely Lane', 'Maidstone', 'Somerset', 'SK22 1DL', 'United Kingdom'],
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

  describe('the "address" property', () => {
    describe('when the address has missing fields', () => {
      beforeEach(() => {
        data = {
          businessAddress: {
            address1: '10 Skirbeck Way',
            address2: 'Lonely Lane',
            city: '',
            county: 'Somerset',
            postcode: 'SK22 1DL',
            country: ''
          }
        }
      })

      test('it should remove them from the address', () => {
        const result = businessDetailsPresenter(data)
        expect(result.address).toEqual(['10 Skirbeck Way', 'Lonely Lane', 'Somerset', 'SK22 1DL'])
      })
    })
  })
})
