// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessFixListPresenter } from '../../../../src/presenters/business/business-fix-list-presenter.js'

describe('businessFixListPresenter', () => {
  let businessDetails
  let payload

  beforeEach(() => {
    businessDetails = {
      orderedSectionsToFix: ['name', 'vat', 'address', 'phone', 'email'],
      info: {
        vat: '123456789',
        businessName: 'Test Business'
      },
      contact: {
        landline: '0123456789',
        mobile: '07123456789',
        email: 'test@test.com'
      }
    }

    payload = null
  })

  describe('when provided with business fix list data', () => {
    test('it correctly presents the data', () => {
      const result = businessFixListPresenter(businessDetails, payload)

      expect(result).toEqual({
        backLink: { href: '/business-fix' },
        pageTitle: 'Your business details to update',
        metaDescription: 'Your business details to update.',
        sections: ['name', 'vat', 'address', 'phone', 'email'],
        businessName: 'Test Business',
        businessTelephone: '0123456789',
        vatNumber: '123456789',
        businessMobile: '07123456789',
        businessEmail: 'test@test.com',
        address: null,
        errors: null
      })
    })
  })

  describe('the "businessName" property', () => {
    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = {
          businessName: 'New Business Name'
        }
      })

      test('it should return the payload as the "businessName" property', () => {
        const result = businessFixListPresenter(businessDetails, payload)

        expect(result.businessName).toEqual('New Business Name')
      })
    })

    describe('when provided with changed business name data', () => {
      beforeEach(() => {
        businessDetails.changeBusinessName = {
          businessName: 'Changed Business Name'
        }
      })

      test('it should return the changed business name as the "businessName" property', () => {
        const result = businessFixListPresenter(businessDetails, payload)

        expect(result.businessName).toEqual('Changed Business Name')
      })
    })
  })

  describe('the "vatNumber" property', () => {
    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = {
          vatNumber: '987654321'
        }
      })

      test('it should return the payload as the "vatNumber" property', () => {
        const result = businessFixListPresenter(businessDetails, payload)

        expect(result.vatNumber).toEqual('987654321')
      })
    })

    describe('when provided with changed VAT number data', () => {
      beforeEach(() => {
        businessDetails.changeBusinessVat = {
          vatNumber: '987654321'
        }
      })

      test('it should return the changed VAT number as the "vatNumber" property', () => {
        const result = businessFixListPresenter(businessDetails, payload)

        expect(result.vatNumber).toEqual('987654321')
      })
    })
  })

  describe('the "address" property', () => {
    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = {
          address1: '1 Test Street',
          address2: 'Test Area',
          address3: '',
          city: 'Testville',
          county: 'Testshire',
          postcode: 'TE1 1ST',
          country: 'UK'
        }
      })

      test('it should return the payload as the "address" property', () => {
        const result = businessFixListPresenter(businessDetails, payload)

        expect(result.address).toEqual({
          address1: '1 Test Street',
          address2: 'Test Area',
          address3: '',
          city: 'Testville',
          county: 'Testshire',
          postcode: 'TE1 1ST',
          country: 'UK'
        })
      })
    })

    describe('when provided with changed business address data', () => {
      beforeEach(() => {
        businessDetails.changeBusinessAddress = {
          address1: '2 Changed Road',
          address2: 'Changed Area',
          address3: '',
          city: 'Changedville',
          county: 'Changedshire',
          postcode: 'CH2 2NG',
          country: 'UK'
        }
      })

      test('it should return the changed business address as the "address" property', () => {
        const result = businessFixListPresenter(businessDetails, payload)

        expect(result.address).toEqual({
          address1: '2 Changed Road',
          address2: 'Changed Area',
          address3: '',
          city: 'Changedville',
          county: 'Changedshire',
          postcode: 'CH2 2NG',
          country: 'UK'
        })
      })
    })

    describe('when no payload and no changed address is provided', () => {
      beforeEach(() => {
        delete businessDetails.changeBusinessAddress
        payload = null
      })

      test('it should return null as the "address" property', () => {
        const result = businessFixListPresenter(businessDetails, payload)

        expect(result.address).toBeNull()
      })
    })
  })

  describe('the "errors" property', () => {
    let errors

    beforeEach(() => {
      errors = {
        businessName: { message: 'Enter your business name' },
        postcode: { message: 'Enter a postcode' },
        businessEmail: { message: 'Enter an email address' }
      }
    })

    test('it sorts errors by section and field order', () => {
      const result = businessFixListPresenter(businessDetails, payload, errors)

      expect(result.errors).toEqual([
        { field: 'businessName', message: 'Enter your business name' },
        { field: 'postcode', message: 'Enter a postcode' },
        { field: 'businessEmail', message: 'Enter an email address' }
      ])
    })
  })
})
