// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessCharityRegistrationNumberChangePresenter } from '../../../../src/presenters/business/business-charity-registration-number-change-presenter.js'

describe('businessCharityRegistrationNumberChangePresenter', () => {
  let data
  let payload

  beforeEach(() => {
    data = {
      businessName: 'Agile Farm Ltd',
      sbi: '800000001',
      registrationNumbers: {
        companiesHouse: null,
        charityCommission: '12345678'
      },
      customer: {
        userName: 'Alfred Waldron'
      }
    }
  })

  describe('when provided with business charity commission registration number change data', () => {
    test('it correctly presents the data', () => {
      const result = businessCharityRegistrationNumberChangePresenter(data)

      expect(result).toEqual({
        backLink: { href: '/business-details' },
        pageTitle: 'Enter the charity commission registration number',
        metaDescription: 'Update the charity commission registration number for your business.',
        businessName: 'Agile Farm Ltd',
        sbi: '800000001',
        userName: 'Alfred Waldron',
        charityCommissionRegistrationNumber: '12345678'
      })
    })
  })

  describe('the "businessName" property', () => {
    describe('when the businessName property is missing', () => {
      beforeEach(() => {
        delete data.businessName
      })

      test('it should return businessName as null', () => {
        const result = businessCharityRegistrationNumberChangePresenter(data)

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
        const result = businessCharityRegistrationNumberChangePresenter(data)

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
        const result = businessCharityRegistrationNumberChangePresenter(data)

        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "charityCommissionRegistrationNumber" property', () => {
    describe('when provided with a changed charity commission registration number', () => {
      beforeEach(() => {
        data.changeBusinessCharityRegistrationNumber = '7654321'
      })

      test('it should return the changed number as the charityCommissionRegistrationNumber', () => {
        const result = businessCharityRegistrationNumberChangePresenter(data)

        expect(result.charityCommissionRegistrationNumber).toEqual('7654321')
      })
    })

    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = '87654321'
      })

      test('it should return the payload as the charityCommissionRegistrationNumber', () => {
        const result = businessCharityRegistrationNumberChangePresenter(data, payload)

        expect(result.charityCommissionRegistrationNumber).toEqual('87654321')
      })
    })
  })
})
