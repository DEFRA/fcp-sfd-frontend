// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessCharityRegistrationNumberCheckPresenter } from '../../../../src/presenters/business/business-charity-registration-number-check-presenter.js'

describe('businessCharityRegistrationNumberCheckPresenter', () => {
  let data

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

  describe('when provided with business charity commission registration number check data', () => {
    test('it correctly presents the data', () => {
      const result = businessCharityRegistrationNumberCheckPresenter(data)

      expect(result).toEqual({
        backLink: { href: '/business-charity-registration-number-change' },
        changeLink: '/business-charity-registration-number-change',
        pageTitle: 'Check your charity commission registration number is correct before submitting',
        metaDescription: 'Check the charity commission registration number for your business is correct.',
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
        const result = businessCharityRegistrationNumberCheckPresenter(data)

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
        const result = businessCharityRegistrationNumberCheckPresenter(data)

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
        const result = businessCharityRegistrationNumberCheckPresenter(data)

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
        const result = businessCharityRegistrationNumberCheckPresenter(data)

        expect(result.charityCommissionRegistrationNumber).toEqual('7654321')
      })
    })

    describe('when there is no changed number', () => {
      test('it should return the stored number as the charityCommissionRegistrationNumber', () => {
        const result = businessCharityRegistrationNumberCheckPresenter(data)

        expect(result.charityCommissionRegistrationNumber).toEqual('12345678')
      })
    })

    describe('when there is no changed number and registrationNumbers is missing', () => {
      beforeEach(() => {
        delete data.registrationNumbers
      })

      test('it should return charityCommissionRegistrationNumber as null', () => {
        const result = businessCharityRegistrationNumberCheckPresenter(data)

        expect(result.charityCommissionRegistrationNumber).toEqual(null)
      })
    })
  })
})
