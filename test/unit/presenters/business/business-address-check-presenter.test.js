// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessAddressCheckPresenter } from '../../../../src/presenters/business/business-address-check-presenter.js'

describe('businessAddressCheckPresenter', () => {
  let businessDetailsData
  let sessionData

  beforeEach(() => {
    businessDetailsData = {
      businessName: 'Agile Farm Ltd',
      sbi: '123456789',
      userName: 'Alfred Waldron'
    }

    sessionData = {
      address1: '10 Skirbeck Way',
      address2: 'Lonely Lane',
      city: 'Maidstone',
      county: 'Somerset',
      postcode: 'SK22 1DL',
      country: 'United Kingdom'
    }
  })

  describe('when provided with business address check data', () => {
    test('it correctly presents the data', () => {
      const result = businessAddressCheckPresenter(businessDetailsData, sessionData)

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
        sbi: '123456789',
        userName: 'Alfred Waldron'
      })
    })
  })

  describe('the "businessName" property', () => {
    describe('when the businessName property is missing', () => {
      beforeEach(() => {
        delete businessDetailsData.businessName
      })

      test('it should return businessName as null', () => {
        const result = businessAddressCheckPresenter(businessDetailsData, sessionData)

        expect(result.businessName).toEqual(null)
      })
    })
  })

  describe('the "sbi" property', () => {
    describe('when the sbi (singleBusinessIdentifier) property is missing', () => {
      beforeEach(() => {
        delete businessDetailsData.sbi
      })

      test('it should return sbi as null', () => {
        const result = businessAddressCheckPresenter(businessDetailsData, sessionData)

        expect(result.sbi).toEqual(null)
      })
    })
  })

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete businessDetailsData.userName
      })

      test('it should return userName as null', () => {
        const result = businessAddressCheckPresenter(businessDetailsData, sessionData)

        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "address" property', () => {
    describe('when the address has missing fields', () => {
      beforeEach(() => {
        sessionData = {
          address1: '10 Skirbeck Way',
          address2: 'Lonely Lane',
          city: '',
          county: 'Somerset',
          postcode: 'SK22 1DL',
          country: ''
        }
      })

      test('it should remove them and return the address as an array', () => {
        const result = businessAddressCheckPresenter(businessDetailsData, sessionData)

        expect(result.address).toEqual(['10 Skirbeck Way', 'Lonely Lane', 'Somerset', 'SK22 1DL'])
      })
    })
  })
})
