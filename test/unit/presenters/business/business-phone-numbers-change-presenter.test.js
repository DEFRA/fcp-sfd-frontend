// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessPhoneNumbersChangePresenter } from '../../../../src/presenters/business/business-phone-numbers-change-presenter.js'

describe('businessPhoneNumbersChangePresenter', () => {
  let data

  beforeEach(() => {
    data = {
      info: {
        businessName: 'Agile Farm Ltd',
        sbi: '123456789'
      },
      customer: {
        userName: 'Alfred Waldron'
      },
      contact: {
        landline: '01234 567891',
        mobile: null
      },
      changeBusinessPhoneNumbers: {}
    }
  })

  describe('when provided with business phone numbers change data', () => {
    test('it correctly presents the data', () => {
      const result = businessPhoneNumbersChangePresenter(data)

      expect(result).toEqual({
        backLink: { href: '/business-details' },
        pageTitle: 'What are your business phone numbers?',
        metaDescription: 'Update the phone numbers for your business.',
        businessName: 'Agile Farm Ltd',
        sbi: '123456789',
        userName: 'Alfred Waldron',
        businessMobile: null,
        businessTelephone: '01234 567891'
      })
    })
  })

  describe('the "businessName" property', () => {
    describe('when the businessName property is missing', () => {
      beforeEach(() => {
        delete data.info.businessName
      })

      test('it should return businessName as null', () => {
        const result = businessPhoneNumbersChangePresenter(data)

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
        const result = businessPhoneNumbersChangePresenter(data)

        expect(result.sbi).toEqual(null)
      })
    })
  })

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete data.customer.userName
      })

      test('it should return userName as null', () => {
        const result = businessPhoneNumbersChangePresenter(data)

        expect(result.userName).toEqual(null)
      })
    })
  })
})
