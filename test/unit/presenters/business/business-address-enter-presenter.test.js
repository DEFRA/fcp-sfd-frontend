// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessAddressEnterPresenter } from '../../../../src/presenters/business/business-address-enter-presenter.js'

describe('businessAddressEnterPresenter', () => {
  let data
  let payload

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
      sbi: '123456789',
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
        sbi: '123456789',
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

  describe('the "sbi" property', () => {
    describe('when the sbi (singleBusinessIdentifier) property is missing', () => {
      beforeEach(() => {
        delete data.sbi
      })

      test('it should return sbi as null', () => {
        const result = businessAddressEnterPresenter(data)

        expect(result.sbi).toEqual(null)
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

  describe('the "address" property', () => {
    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = {
          address1: 'A different address',
          city: 'Maidstone',
          county: 'A new county',
          postcode: 'BA123 ABC',
          country: 'United Kingdom'
        }
      })

      test('it should return the payload as the address', () => {
        const result = businessAddressEnterPresenter(data, payload)

        expect(result.address).toEqual(payload)
      })
    })
  })
})
