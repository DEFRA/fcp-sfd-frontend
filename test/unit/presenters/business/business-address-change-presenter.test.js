// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessAddressChangePresenter } from '../../../../src/presenters/business/business-address-change-presenter.js'

describe('businessAddressChangePresenter', () => {
  let data
  let payload

  beforeEach(() => {
    data = {
      info: {
        businessName: 'Agile Farm Ltd',
        sbi: '123456789'
      },
      customer: {
        userName: 'Alfred Waldron'
      },
      address: { postcode: 'SK22 1DL' },
      changeBusinessPostcode: {}
    }
  })

  describe('when provided with business address change data', () => {
    test('it correctly presents the data', () => {
      const result = businessAddressChangePresenter(data)

      expect(result).toEqual({
        backLink: { href: '/business-details' },
        pageTitle: 'What is your business address?',
        metaDescription: 'Update the address for your business.',
        postcode: 'SK22 1DL',
        businessName: 'Agile Farm Ltd',
        sbi: '123456789',
        userName: 'Alfred Waldron'
      })
    })
  })

  describe('the "businessName" property', () => {
    describe('when the businessName property is missing', () => {
      beforeEach(() => {
        delete data.info.businessName
      })

      test('it should return businessName as null', () => {
        const result = businessAddressChangePresenter(data)

        expect(result.businessName).toEqual(null)
      })
    })
  })

  describe('the "sbi" property', () => {
    describe('when the sbi (singleBusinessIdentifier) property is missing', () => {
      beforeEach(() => {
        delete data.info.sbi
      })

      test('it should return sbi as null', () => {
        const result = businessAddressChangePresenter(data)

        expect(result.sbi).toEqual(null)
      })
    })
  })

  describe('the "postcode" property', () => {
    describe('when provided with a changed business postcode', () => {
      beforeEach(() => {
        data.changeBusinessPostcode.postcode = 'NEW 123'
      })

      test('it should return the changed postcode as the postcode', () => {
        const result = businessAddressChangePresenter(data)

        expect(result.postcode).toEqual(data.changeBusinessPostcode.postcode)
      })
    })

    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = 'NEW 321'
      })

      test('it should return the payload as the business postcode', () => {
        const result = businessAddressChangePresenter(data, payload)

        expect(result.postcode).toEqual(payload)
      })
    })
  })
})
