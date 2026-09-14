// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessFixCheckPresenter } from '../../../../src/presenters/business/business-fix-check-presenter.js'

describe('businessFixCheckPresenter', () => {
  let data

  beforeEach(() => {
    data = {
      orderedSectionsToFix: [
        'name',
        'email',
        'address',
        'phone',
        'vat'
      ],
      changeBusinessName: {
        businessName: 'Test Business Ltd'
      },
      changeBusinessEmail: {
        businessEmail: 'info@testbusiness.com'
      },
      changeBusinessAddress: {
        address1: '1 Business Street',
        address2: 'Business Area',
        address3: '',
        city: 'Businessville',
        county: '',
        postcode: 'BU1 1SS',
        country: 'UK'
      },
      changeBusinessPhoneNumbers: {
        businessTelephone: '0123456789',
        businessMobile: '07123456789'
      },
      changeBusinessVat: {
        vatNumber: '123456789'
      },
      customer: {
        userName: 'Jane Doe'
      },
      sbi: '123456789'
    }
  })

  describe('when provided with business fix data', () => {
    test('it correctly presents the data', () => {
      const result = businessFixCheckPresenter(data)

      expect(result).toEqual({
        backLink: { href: '/business-fix-list' },
        pageTitle: 'Check your details are correct before submitting',
        metaDescription: 'Check your details are correct before submitting',
        changeLink: '/business-fix-list',
        sections: [
          'name',
          'email',
          'address',
          'phone',
          'vat'
        ],
        businessName: null,
        changeBusinessName: 'Test Business Ltd',
        sbi: '123456789',
        userName: 'Jane Doe',
        businessEmail: 'info@testbusiness.com',
        address: [
          '1 Business Street',
          'Business Area',
          'Businessville',
          'BU1 1SS',
          'UK'
        ],
        vatNumber: '123456789',
        businessTelephone: {
          telephone: '0123456789',
          mobile: '07123456789'
        }
      })
    })
  })

  describe('the "businessName" property', () => {
    describe('when changeBusinessName is missing', () => {
      beforeEach(() => {
        delete data.changeBusinessName
      })

      test('it should return null', () => {
        const result = businessFixCheckPresenter(data)

        expect(result.businessName).toBeNull()
      })
    })
  })

  describe('the "businessEmail" property', () => {
    describe('when changeBusinessEmail is missing', () => {
      beforeEach(() => {
        delete data.changeBusinessEmail
      })

      test('it should return null', () => {
        const result = businessFixCheckPresenter(data)

        expect(result.businessEmail).toBeNull()
      })
    })
  })

  describe('the "address" property', () => {
    describe('when changeBusinessAddress is missing', () => {
      beforeEach(() => {
        delete data.changeBusinessAddress
      })

      test('it should return null', () => {
        const result = businessFixCheckPresenter(data)

        expect(result.address).toBeNull()
      })
    })

    test('it filters out empty address values', () => {
      const result = businessFixCheckPresenter(data)

      expect(result.address).not.toContain('')
    })
  })

  describe('the "vatNumber" property', () => {
    describe('when changeBusinessVat is missing', () => {
      beforeEach(() => {
        delete data.changeBusinessVat
      })

      test('it should return null', () => {
        const result = businessFixCheckPresenter(data)

        expect(result.vatNumber).toBeNull()
      })
    })
  })

  describe('the "businessTelephone" property', () => {
    describe('when changeBusinessPhoneNumbers is missing', () => {
      beforeEach(() => {
        delete data.changeBusinessPhoneNumbers
      })

      test('it should return null values for both numbers', () => {
        const result = businessFixCheckPresenter(data)

        expect(result.businessTelephone).toEqual({
          telephone: null,
          mobile: null
        })
      })
    })
  })

  describe('the "sbi" property', () => {
    describe('when sbi is missing', () => {
      beforeEach(() => {
        delete data.sbi
      })

      test('it should return null', () => {
        const result = businessFixCheckPresenter(data)

        expect(result.sbi).toBeNull()
      })
    })
  })

  describe('the "userName" property', () => {
    describe('when customer is missing', () => {
      beforeEach(() => {
        delete data.customer
      })

      test('it should return null', () => {
        const result = businessFixCheckPresenter(data)

        expect(result.userName).toBeNull()
      })
    })

    describe('when userName is missing from customer', () => {
      beforeEach(() => {
        data.customer = {}
      })

      test('it should return null', () => {
        const result = businessFixCheckPresenter(data)

        expect(result.userName).toBeNull()
      })
    })
  })
})
