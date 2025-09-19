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
        fullName: 'Alfred Waldron'
      },
      address: { postcode: 'SK22 1DL' }
    }
  })

  describe('when provided with business address change data', () => {
    test('it correctly presents the data', () => {
      const result = businessAddressChangePresenter(data)

      expect(result).toEqual({
        backLink: { href: '/business-details' },
        pageTitle: 'What is your business address?',
        metaDescription: 'Update the address for your business.',
        businessPostcode: 'SK22 1DL',
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

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete data.customer.fullName
      })

      test('it should return userName as null', () => {
        const result = businessAddressChangePresenter(data)

        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "businessPostcode" property', () => {
    describe('when provided with a changed business postcode', () => {
      beforeEach(() => {
        data.changeBusinessPostcode = 'NEW 123'
      })

      test('it should return the changed postcode as the businessPostcode', () => {
        const result = businessAddressChangePresenter(data)

        expect(result.businessPostcode).toEqual(data.changeBusinessPostcode)
      })
    })

    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = 'NEW 321'
      })

      test('it should return the payload as the business postcode', () => {
        const result = businessAddressChangePresenter(data, payload)

        expect(result.businessPostcode).toEqual(payload)
      })
    })
  })
})
