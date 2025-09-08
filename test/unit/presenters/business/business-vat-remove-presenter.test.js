// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessVatRemovePresenter } from '../../../../src/presenters/business/business-vat-remove-presenter.js'

describe('businessVatRemovePresenter', () => {
  let data

  beforeEach(() => {
    data = {
      info: {
        businessName: 'Agile Farm Ltd',
        sbi: '123456789',
        vat: 'GB123456789'
      },
      customer: {
        fullName: 'Alfred Waldron'
      }
    }
  })

  describe('when provided with business vat remove data', () => {
    test('it correctly presents the data', () => {
      const result = businessVatRemovePresenter(data)

      expect(result).toEqual({
        backLink: { href: '/business-details' },
        pageTitle: 'Are you sure you want to remove your VAT registration number?',
        metaDescription: 'Are you sure you want to remove your VAT registration number?',
        vatNumber: 'GB123456789',
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
        const result = businessVatRemovePresenter(data)

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
        const result = businessVatRemovePresenter(data)

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
        const result = businessVatRemovePresenter(data)

        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "vatNumber" property', () => {
    describe('when the vat property is missing', () => {
      beforeEach(() => {
        delete data.info.vat
      })

      test('it should return vatNumber as null', () => {
        const result = businessVatRemovePresenter(data)

        expect(result.vatNumber).toEqual(null)
      })
    })

    describe('when the vat property is null', () => {
      beforeEach(() => {
        data.info.vat = null
      })

      test('it should return vatNumber as null', () => {
        const result = businessVatRemovePresenter(data)

        expect(result.vatNumber).toEqual(null)
      })
    })
  })
})
