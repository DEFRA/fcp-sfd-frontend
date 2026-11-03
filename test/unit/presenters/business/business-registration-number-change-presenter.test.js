// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'
import { constants } from '@defra/fcp-sfd-frontend-engine'

// Thing under test
import { businessRegistrationNumberChangePresenter } from '../../../../src/presenters/business/business-registration-number-change-presenter.js'

describe('businessRegistrationNumberChangePresenter', () => {
  let data
  let payload

  beforeEach(() => {
    data = {
      sbi: '800000001',
      businessName: 'Test Farm',
      customer: { userName: 'Alex Smith' },
      legalStatusCode: constants.business.CHARITY_REGISTRATION_LEGAL_STATUS_CODES[0]
    }
    payload = undefined
  })

  describe('when the legal status requires a charity registration number', () => {
    test('it correctly presents the data', () => {
      const result = businessRegistrationNumberChangePresenter(data, payload)

      expect(result.backLink).toEqual({ href: '/business-details' })
      expect(result.pageTitle).toBe('Enter the charity commission registration number')
      expect(result.metaDescription).toBe('Enter the Charity Commission registration number for your business.')
      expect(result.hintText).toBe('This is 6 to 8 numbers, for example, 12345678.')
      expect(result.field).toBe('charityCommissionRegistrationNumber')
      expect(result.userName).toBe('Alex Smith')
      expect(result.businessName).toBe('Test Farm')
      expect(result.sbi).toBe('800000001')
    })

    test('it uses the in-progress session value when present', () => {
      data.changeBusinessCharityCommissionRegistrationNumber = '1234567'

      const result = businessRegistrationNumberChangePresenter(data, payload)

      expect(result.registrationNumber).toBe('1234567')
    })

    test('it falls back to the fetched charity registration number when no session value exists', () => {
      data.registrationNumbers = { charityCommission: '7654321' }

      const result = businessRegistrationNumberChangePresenter(data, payload)

      expect(result.registrationNumber).toBe('7654321')
    })

    test('it uses the submitted payload over the session value', () => {
      data.changeBusinessCharityCommissionRegistrationNumber = '1234567'
      payload = { charityCommissionRegistrationNumber: '7654321' }

      const result = businessRegistrationNumberChangePresenter(data, payload)

      expect(result.registrationNumber).toBe('7654321')
    })
  })

  describe('when the legal status requires a company registration number', () => {
    beforeEach(() => {
      data.legalStatusCode = constants.business.COMPANY_REGISTRATION_LEGAL_STATUS_CODES[0]
    })

    test('it correctly presents the data', () => {
      const result = businessRegistrationNumberChangePresenter(data, payload)

      expect(result.pageTitle).toBe('Enter the company registration number')
      expect(result.metaDescription).toBe('Enter the company registration number for your business.')
      expect(result.hintText).toBe('This is 8 characters, which may be either 8 numbers or 2 letters and 6 numbers. For example, 12345678 or SC123456.')
      expect(result.field).toBe('companyRegistrationNumber')
    })

    test('it uses the in-progress session value when present', () => {
      data.changeBusinessCompanyRegistrationNumber = '12345678'

      const result = businessRegistrationNumberChangePresenter(data, payload)

      expect(result.registrationNumber).toBe('12345678')
    })

    test('it falls back to the fetched company registration number when no session value exists', () => {
      data.registrationNumbers = { companiesHouse: 'AB123456' }

      const result = businessRegistrationNumberChangePresenter(data, payload)

      expect(result.registrationNumber).toBe('AB123456')
    })
  })

  describe('the "registrationNumber" property', () => {
    test('it is null when nothing has been entered', () => {
      const result = businessRegistrationNumberChangePresenter(data, payload)

      expect(result.registrationNumber).toBeNull()
    })
  })

  describe('when optional business details are missing', () => {
    test('it returns null for the user name, business name and sbi', () => {
      delete data.customer
      delete data.businessName
      delete data.sbi

      const result = businessRegistrationNumberChangePresenter(data, payload)

      expect(result.userName).toBeNull()
      expect(result.businessName).toBeNull()
      expect(result.sbi).toBeNull()
    })
  })
})
