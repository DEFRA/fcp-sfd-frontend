// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessCompanyRegistrationNumberCheckPresenter } from '../../../../src/presenters/business/business-company-registration-number-check-presenter.js'

describe('businessCompanyRegistrationNumberCheckPresenter', () => {
  let data

  beforeEach(() => {
    data = {
      businessName: 'Agile Farm Ltd',
      sbi: '800000001',
      registrationNumbers: {
        companiesHouse: '12345678',
        charityCommission: null
      },
      customer: {
        userName: 'Alfred Waldron'
      }
    }
  })

  describe('when provided with business company registration number check data', () => {
    test('it correctly presents the data', () => {
      const result = businessCompanyRegistrationNumberCheckPresenter(data)

      expect(result).toEqual({
        backLink: { href: '/business-company-registration-number-change' },
        changeLink: '/business-company-registration-number-change',
        pageTitle: 'Check your company registration number is correct before submitting',
        metaDescription: 'Check the company registration number for your business is correct.',
        businessName: 'Agile Farm Ltd',
        sbi: '800000001',
        userName: 'Alfred Waldron',
        companyRegistrationNumber: '12345678'
      })
    })
  })

  describe('the "businessName" property', () => {
    describe('when the businessName property is missing', () => {
      beforeEach(() => {
        delete data.businessName
      })

      test('it should return businessName as null', () => {
        const result = businessCompanyRegistrationNumberCheckPresenter(data)

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
        const result = businessCompanyRegistrationNumberCheckPresenter(data)

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
        const result = businessCompanyRegistrationNumberCheckPresenter(data)

        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "companyRegistrationNumber" property', () => {
    describe('when provided with a changed company registration number', () => {
      beforeEach(() => {
        data.changeBusinessCompanyRegistrationNumber = 'SC123456'
      })

      test('it should return the changed number as the companyRegistrationNumber', () => {
        const result = businessCompanyRegistrationNumberCheckPresenter(data)

        expect(result.companyRegistrationNumber).toEqual('SC123456')
      })
    })

    describe('when there is no changed number', () => {
      test('it should return the stored number as the companyRegistrationNumber', () => {
        const result = businessCompanyRegistrationNumberCheckPresenter(data)

        expect(result.companyRegistrationNumber).toEqual('12345678')
      })
    })

    describe('when there is no changed number and registrationNumbers is missing', () => {
      beforeEach(() => {
        delete data.registrationNumbers
      })

      test('it should return companyRegistrationNumber as null', () => {
        const result = businessCompanyRegistrationNumberCheckPresenter(data)

        expect(result.companyRegistrationNumber).toEqual(null)
      })
    })
  })
})
