// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessVatChangePresenter } from '../../../../src/presenters/business/business-vat-change-presenter.js'

describe('businessVatChangePresenter', () => {
  let data
  let payload

  beforeEach(() => {
    data = {
      info: {
        businessName: 'Agile Farm Ltd',
        sbi: '123456789',
        vat: 'GB123456789'
      },
      customer: {
        userName: 'Alfred Waldron'
      },
      contact: {
        email: 'test@test.com'
      }
    }
  })

  describe('when provided with business vat change data', () => {
    test('it correctly presents the data', () => {
      const result = businessVatChangePresenter(data)

      expect(result).toEqual({
        backLink: { href: '/business-details' },
        pageTitle: 'What is your VAT registration number?',
        metaDescription: 'Update the VAT registration number for your business.',
        businessName: 'Agile Farm Ltd',
        sbi: '123456789',
        userName: 'Alfred Waldron',
        vatNumber: 'GB123456789'
      })
    })
  })

  describe('the "businessName" property', () => {
    describe('when the businessName property is missing', () => {
      beforeEach(() => {
        delete data.info.businessName
      })

      test('it should return businessName as null', () => {
        const result = businessVatChangePresenter(data)

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
        const result = businessVatChangePresenter(data)

        expect(result.sbi).toEqual(null)
      })
    })
  })

  describe('the "vat number" property', () => {
    describe('when provided with a changed vat number', () => {
      beforeEach(() => {
        data.changeBusinessVat = 'GB987654321'
      })

      test('it should return the changed vatNumber as the vatNumber', () => {
        const result = businessVatChangePresenter(data)

        expect(result.vatNumber).toEqual('GB987654321')
      })
    })

    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = 'GB876543219'
      })

      test('it should return the payload as the vatNumber', () => {
        const result = businessVatChangePresenter(data, payload)

        expect(result.vatNumber).toEqual('GB876543219')
      })
    })
  })
})
