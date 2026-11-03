// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'
import { constants } from '@defra/fcp-sfd-frontend-engine'

// Thing under test
import { businessRegistrationNumberCheckPresenter } from '../../../../src/presenters/business/business-registration-number-check-presenter.js'

describe('businessRegistrationNumberCheckPresenter', () => {
  let data

  beforeEach(() => {
    data = {
      sbi: '800000001',
      businessName: 'Test Farm',
      customer: { userName: 'Alex Smith' }
    }
  })

  describe('when the legal status requires a charity registration number', () => {
    beforeEach(() => {
      data.legalStatusCode = constants.business.CHARITY_REGISTRATION_LEGAL_STATUS_CODES[0]
      data.changeBusinessCharityCommissionRegistrationNumber = '1234567'
    })

    test('it correctly presents the data', () => {
      const result = businessRegistrationNumberCheckPresenter(data)

      expect(result.pageTitle).toBe('Check your charity commission registration number is correct before submitting')
      expect(result.metaDescription).toBe('Check the charity commission registration number for your business is correct.')
      expect(result.userName).toBe('Alex Smith')
      expect(result.businessName).toBe('Test Farm')
      expect(result.sbi).toBe('800000001')
    })

    test('the back link and change link point to the change page', () => {
      const result = businessRegistrationNumberCheckPresenter(data)

      expect(result.backLink).toEqual({ href: '/business-registration-number-change' })
      expect(result.changeLink).toBe('/business-registration-number-change')
    })

    test('the charity registration number is played back', () => {
      const result = businessRegistrationNumberCheckPresenter(data)

      expect(result.registrationNumberLabel).toBe('Charity commission registration number')
      expect(result.registrationNumber).toBe('1234567')
    })

    test('it falls back to the fetched charity registration number when no session value exists', () => {
      delete data.changeBusinessCharityCommissionRegistrationNumber
      data.registrationNumbers = { charityCommission: '7654321' }

      const result = businessRegistrationNumberCheckPresenter(data)

      expect(result.registrationNumber).toBe('7654321')
    })

    test('it is null when no number has been entered', () => {
      delete data.changeBusinessCharityCommissionRegistrationNumber

      const result = businessRegistrationNumberCheckPresenter(data)

      expect(result.registrationNumber).toBeNull()
    })
  })

  describe('when the legal status requires a company registration number', () => {
    beforeEach(() => {
      data.legalStatusCode = constants.business.COMPANY_REGISTRATION_LEGAL_STATUS_CODES[0]
      data.changeBusinessCompanyRegistrationNumber = '12345678'
    })

    test('it correctly presents the data', () => {
      const result = businessRegistrationNumberCheckPresenter(data)

      expect(result.pageTitle).toBe('Check your company registration number is correct before submitting')
      expect(result.metaDescription).toBe('Check the company registration number for your business is correct.')
    })

    test('the company registration number is played back', () => {
      const result = businessRegistrationNumberCheckPresenter(data)

      expect(result.registrationNumberLabel).toBe('Company registration number')
      expect(result.registrationNumber).toBe('12345678')
    })

    test('it falls back to the fetched company registration number when no session value exists', () => {
      delete data.changeBusinessCompanyRegistrationNumber
      data.registrationNumbers = { companiesHouse: 'AB123456' }

      const result = businessRegistrationNumberCheckPresenter(data)

      expect(result.registrationNumber).toBe('AB123456')
    })

    test('it is null when no number has been entered', () => {
      delete data.changeBusinessCompanyRegistrationNumber

      const result = businessRegistrationNumberCheckPresenter(data)

      expect(result.registrationNumber).toBeNull()
    })
  })

  describe('when optional business details are missing', () => {
    test('it returns null for the user name, business name and sbi', () => {
      delete data.customer
      delete data.businessName
      delete data.sbi

      const result = businessRegistrationNumberCheckPresenter(data)

      expect(result.userName).toBeNull()
      expect(result.businessName).toBeNull()
      expect(result.sbi).toBeNull()
    })
  })
})
