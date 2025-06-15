// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessAddressEnterPresenter } from '../../../../src/presenters/business/business-address-enter-presenter.js'

describe('businessAddressEnterPresenter', () => {
  let data

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
      singleBusinessIdentifier: '123456789',
      userName: 'Alfred Waldron'
    }
  })

  describe('when provided with business address enter data', () => {
    test('it correctly presents the data', () => {
      const result = businessAddressEnterPresenter(data)

      expect(result).toEqual({
        backLink: { href: '/business-details' },
        pageTitle: 'Enter your business address',
        metaDescription: 'Enter the address for your business.',
        address: {
          address1: '10 Skirbeck Way',
          address2: 'Lonely Lane',
          city: 'Maidstone',
          country: 'United Kingdom',
          county: 'Somerset',
          postcode: 'SK22 1DL'
        },
        businessName: 'Agile Farm Ltd',
        singleBusinessIdentifier: '123456789',
        userName: 'Alfred Waldron'
      })
    })
  })

  describe('the "businessName" property', () => {
    describe('when the businessName property is missing', () => {
      beforeEach(() => {
        delete data.businessName
      })

      test('it should return businessName as null', () => {
        const result = businessAddressEnterPresenter(data)

        expect(result.businessName).toEqual(null)
      })
    })
  })

  describe('the "singleBusinessIdentifier" property', () => {
    describe('when the singleBusinessIdentifier property is missing', () => {
      beforeEach(() => {
        delete data.singleBusinessIdentifier
      })

      test('it should return singleBusinessIdentifier as null', () => {
        const result = businessAddressEnterPresenter(data)

        expect(result.singleBusinessIdentifier).toEqual(null)
      })
    })
  })

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete data.userName
      })

      test('it should return userName as null', () => {
        const result = businessAddressEnterPresenter(data)

        expect(result.userName).toEqual(null)
      })
    })
  })
})
