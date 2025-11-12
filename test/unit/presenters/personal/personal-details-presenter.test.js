// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { personalDetailsPresenter } from '../../../../src/presenters/personal/personal-details-presenter.js'

// Mock data
import { mappedData } from '../../../mocks/mock-personal-details.js'

describe('personalDetailsPresenter', () => {
  let yar
  let data

  beforeEach(() => {
    vi.clearAllMocks()

    // Deep clone the data to avoid mutation across tests
    data = JSON.parse(JSON.stringify(mappedData))

    // Mock yar session manager
    yar = {
      flash: vi.fn().mockReturnValue([{ title: 'Update', text: 'Personal details updated successfully' }])
    }
  })

  describe('when provided with personal details data', () => {
    test('it correctly presents the data', () => {
      const result = personalDetailsPresenter(data, yar)

      expect(result).toEqual({
        backLink: {
          text: `Back to ${data.business.info.name}`,
          href: '/home'
        },
        notification: { title: 'Update', text: 'Personal details updated successfully' },
        pageTitle: 'View and update your personal details',
        metaDescription: 'View and update your personal details.',
        userName: data.info.userName,
        address: [
          'THE COACH HOUSE',
          'STOCKWELL HALL',
          '7 HAREWOOD AVENUE',
          'DARLINGTON',
          'Dorset',
          'CO9 3LS',
          'United Kingdom'
        ],
        crn: data.crn,
        fullName: 'John M Doe',
        dateOfBirth: '1 January 1990',
        dobChangeLink: '/account-date-of-birth-change',
        personalTelephone: {
          telephone: data.contact.telephone,
          mobile: 'Not added',
          action: 'Change',
          link: '/account-phone-numbers-change'
        },
        personalEmail: {
          email: data.contact.email,
          action: 'Change',
          link: '/account-email-change'
        }
      })
    })
  })

  describe('the backLink property', () => {
    describe('when the businessName property is missing', () => {
      test('it should return the text "Back"', () => {
        data.business.info.name = null
        const result = personalDetailsPresenter(data, yar)

        expect(result.backLink.text).toEqual('Back')
      })
    })
  })

  describe('the "personalTelephone" property', () => {
    describe('when both telephone and mobile properties have values', () => {
      test('it should return the actual values', () => {
        data.contact.telephone = '01234567890'
        data.contact.mobile = '07123456789'
        const result = personalDetailsPresenter(data, yar)

        expect(result.personalTelephone.telephone).toEqual('01234567890')
        expect(result.personalTelephone.mobile).toEqual('07123456789')
      })
    })

    describe('when the telephone property is missing', () => {
      test('returns "Not added" if telephone is missing', () => {
        data.contact.telephone = null
        const result = personalDetailsPresenter(data, yar)

        expect(result.personalTelephone.telephone).toBe('Not added')
      })
    })
  })

  describe('the "personalMobile" property', () => {
    describe('when the mobile property is missing', () => {
      test('returns "Not added" if mobile is missing', () => {
        data.contact.mobile = null

        const result = personalDetailsPresenter(data, yar)

        expect(result.personalTelephone.mobile).toBe('Not added')
      })
    })
  })

  describe('the "personalPhoneAction" property', () => {
    describe('when both telephone and mobile properties have values', () => {
      test('it should return the text "Change"', () => {
        data.contact.telephone = '01234567890'
        data.contact.mobile = '07123456789'
        const result = personalDetailsPresenter(data, yar)

        expect(result.personalTelephone.action).toEqual('Change')
      })
    })

    describe('when only one of the properties has a value', () => {
      test('it should return the text "Change"', () => {
        data.contact.telephone = '01234567890'
        data.contact.mobile = null
        const result = personalDetailsPresenter(data, yar)

        expect(result.personalTelephone.action).toEqual('Change')
      })
    })

    describe('when both properties are null', () => {
      test('it should return the text "Add"', () => {
        data.contact.telephone = null
        data.contact.mobile = null
        const result = personalDetailsPresenter(data, yar)

        expect(result.personalTelephone.action).toEqual('Add')
      })
    })
  })

  describe('the "notification" property', () => {
    test('returns null if yar is falsy', () => {
      const result = personalDetailsPresenter(data, null)

      expect(result.notification).toBe(null)
    })
  })

  describe('the "fullName" property', () => {
    test('returns the fullNameJoined string from mapper', () => {
      const result = personalDetailsPresenter(data, yar)

      expect(result.fullName).toBe('John M Doe')
      expect(result.fullName).toBe(data.info.fullNameJoined)
    })
  })

  describe('the "personalEmail.email" property', () => {
    describe('when the email property is missing', () => {
      test('it should return the text "Not added"', () => {
        data.contact.email = null
        const result = personalDetailsPresenter(data, yar)

        expect(result.personalEmail.email).toEqual('Not added')
      })
    })

    describe('when the email property has a value', () => {
      test('it should return the email address', () => {
        data.contact.email = 'test@test.com'
        const result = personalDetailsPresenter(data, yar)

        expect(result.personalEmail.email).toEqual('test@test.com')
      })
    })
  })

  describe('the "personalEmail.action" property', () => {
    describe('when the personalEmail property is missing', () => {
      test('it should return the text "Add"', () => {
        data.contact.email = null
        const result = personalDetailsPresenter(data, yar)

        expect(result.personalEmail.action).toEqual('Add')
      })
    })

    describe('when the personalEmail property has a value', () => {
      test('it should return the text "Change"', () => {
        data.contact.email = 'test@test.com'
        const result = personalDetailsPresenter(data, yar)

        expect(result.personalEmail.action).toEqual('Change')
      })
    })
  })
})
