// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessAddressCheckPresenter } from '../../../../src/presenters/business/business-address-check-presenter.js'

describe('businessAddressCheckPresenter', () => {
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

  describe('when provided with business address check data', () => {
    test('it correctly presents the data', () => {
      const result = businessAddressCheckPresenter(data)

      expect(result).toEqual({
        backLink: { href: '/business-address-enter' },
        cancelLink: '/business-details',
        changeLink: '/business-address-enter',
        pageTitle: 'Check your business address is correct before submitting',
        metaDescription: 'Check the address for your business is correct.',
        address: [
          '10 Skirbeck Way',
          'Lonely Lane',
          'Maidstone',
          'Somerset',
          'SK22 1DL',
          'United Kingdom'
        ],
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
        const result = businessAddressCheckPresenter(data)

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
        const result = businessAddressCheckPresenter(data)

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
        const result = businessAddressCheckPresenter(data)

        expect(result.userName).toEqual(null)
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
        const result = businessAddressCheckPresenter(data)

        expect(result.address).toEqual(['10 Skirbeck Way', 'Lonely Lane', 'Somerset', 'SK22 1DL'])
      })
    })
  })
})
