// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalFixCheckPresenter } from '../../../../src/presenters/personal/personal-fix-check-presenter.js'

describe('personalFixCheckPresenter', () => {
  let data

  beforeEach(() => {
    data = {
      orderedSectionsToFix: ['name', 'dob', 'address', 'phone', 'email'],
      changePersonalName: {
        first: 'Alfred',
        middle: 'J',
        last: 'Waldron'
      },
      changePersonalDob: {
        day: '5',
        month: '7',
        year: '1982'
      },
      changePersonalEmail: {
        personalEmail: 'alfred@example.com'
      },
      changePersonalAddress: {
        address1: '1 Test Street',
        address2: 'Test Area',
        address3: '',
        city: 'Testville',
        county: '',
        postcode: 'TE1 1ST',
        country: 'UK'
      },
      changePersonalPhoneNumbers: {
        personalTelephone: '0123456789',
        personalMobile: '07123456789'
      },
      userName: 'Jane Doe'
    }
  })

  describe('when provided with personal fix data', () => {
    test('it correctly presents the data', () => {
      const result = personalFixCheckPresenter(data)

      expect(result).toEqual({
        userName: 'Jane Doe',
        backLink: { href: '/personal-fix-list' },
        pageTitle: 'Check your details are correct before submitting',
        metaDescription: 'Check your details are correct before submitting',
        changeLink: '/personal-fix-list',
        sections: ['name', 'dob', 'address', 'phone', 'email'],
        fullName: 'Alfred J Waldron',
        dateOfBirth: '5 July 1982',
        personalEmail: 'alfred@example.com',
        address: [
          '1 Test Street',
          'Test Area',
          'Testville',
          'TE1 1ST',
          'UK'
        ],
        personalTelephone: {
          telephone: '0123456789',
          mobile: '07123456789'
        }
      })
    })
  })

  describe('the "fullName" property', () => {
    describe('when changePersonalName is missing', () => {
      beforeEach(() => {
        delete data.changePersonalName
      })

      test('it should return null', () => {
        const result = personalFixCheckPresenter(data)

        expect(result.fullName).toBeNull()
      })
    })
  })

  describe('the "dateOfBirth" property', () => {
    describe('when the year is not 4 digits', () => {
      beforeEach(() => {
        data.changePersonalDob = { day: '5', month: '7', year: '33' }
      })

      test('it does not interpret the year as 2033', () => {
        const result = personalFixCheckPresenter(data)

        expect(result.dateOfBirth).toEqual('5 July 33')
      })
    })

    describe('when changePersonalDob is missing', () => {
      beforeEach(() => {
        delete data.changePersonalDob
      })

      test('it should return null', () => {
        const result = personalFixCheckPresenter(data)

        expect(result.dateOfBirth).toBeNull()
      })
    })
  })

  describe('the "personalEmail" property', () => {
    describe('when changePersonalEmail is missing', () => {
      beforeEach(() => {
        delete data.changePersonalEmail
      })

      test('it should return null', () => {
        const result = personalFixCheckPresenter(data)

        expect(result.personalEmail).toBeNull()
      })
    })
  })

  describe('the "address" property', () => {
    describe('when changePersonalAddress is missing', () => {
      beforeEach(() => {
        delete data.changePersonalAddress
      })

      test('it should return null', () => {
        const result = personalFixCheckPresenter(data)

        expect(result.address).toBeNull()
      })
    })

    test('it filters out empty address values', () => {
      const result = personalFixCheckPresenter(data)

      expect(result.address).not.toContain('')
    })
  })

  describe('the "personalTelephone" property', () => {
    describe('when changePersonalPhoneNumbers is missing', () => {
      beforeEach(() => {
        delete data.changePersonalPhoneNumbers
      })

      test('it should return null values for both numbers', () => {
        const result = personalFixCheckPresenter(data)

        expect(result.personalTelephone).toEqual({
          telephone: null,
          mobile: null
        })
      })
    })
  })
})
