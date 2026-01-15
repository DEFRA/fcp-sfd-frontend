// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { personalDetailsPresenter } from '../../../../src/presenters/personal/personal-details-presenter.js'

// Mock data
import { mappedData } from '../../../mocks/mock-personal-details.js'

// Mock dependencies
import { config } from '../../../../src/config/index.js'

// Mock imports
vi.mock('../../../../src/config/index.js', () => ({
  config: {
    get: vi.fn()
  }
}))

describe('personalDetailsPresenter', () => {
  let yar
  let data
  let hasValidPersonalDetails = true
  let sectionsNeedingUpdate = []

  beforeEach(async () => {
    vi.clearAllMocks()

    // Default: interrupter OFF
    config.get.mockReturnValue(true)

    // Deep clone the data to avoid mutation across tests
    data = JSON.parse(JSON.stringify(mappedData))

    // Mock yar session manager
    yar = {
      flash: vi.fn().mockReturnValue([{ title: 'Update', text: 'Personal details updated successfully' }])
    }
  })

  describe('when provided with personal details data', () => {
    test('it correctly presents the data', () => {
      const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

      expect(result).toEqual({
        backLink: {
          text: `Back to ${data.business.info.name}`,
          href: '/home'
        },
        notification: { title: 'Update', text: 'Personal details updated successfully' },
        pageTitle: 'View and update your personal details',
        metaDescription: 'View and update your personal details.',
        userName: 'John Doe',
        crn: data.crn,
        personalAddress: {
          address: [
            'THE COACH HOUSE',
            'STOCKWELL HALL',
            '7 HAREWOOD AVENUE',
            'DARLINGTON',
            'Dorset',
            'CO9 3LS',
            'United Kingdom'
          ],
          action: 'Change',
          changeLink: '/account-address-change'
        },
        personalName: {
          fullName: 'John M Doe',
          action: 'Change',
          changeLink: '/account-name-change'
        },
        dob: {
          fullDateOfBirth: '1 January 1990',
          action: 'Change',
          changeLink: '/account-date-of-birth-change'
        },
        personalTelephone: {
          telephone: data.contact.telephone,
          mobile: 'Not added',
          action: 'Change',
          changeLink: '/account-phone-numbers-change'
        },
        personalEmail: {
          email: data.contact.email,
          action: 'Change',
          changeLink: '/account-email-change'
        }
      })
    })
  })

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      test('it should return null', () => {
        data.info.userName = null
        const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

        expect(result.userName).toBeNull()
      })
    })
  })

  describe('the backLink property', () => {
    describe('when the businessName property is missing', () => {
      test('it should return the text "Back"', () => {
        data.business.info.name = null
        const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

        expect(result.backLink.text).toEqual('Back')
      })
    })
  })

  describe('the "personalTelephone" property', () => {
    describe('when both telephone and mobile properties have values', () => {
      test('it should return the actual values', () => {
        data.contact.telephone = '01234567890'
        data.contact.mobile = '07123456789'
        const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

        expect(result.personalTelephone.telephone).toEqual('01234567890')
        expect(result.personalTelephone.mobile).toEqual('07123456789')
      })
    })

    describe('when the telephone property is missing', () => {
      test('returns "Not added" if telephone is missing', () => {
        data.contact.telephone = null
        const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

        expect(result.personalTelephone.telephone).toBe('Not added')
      })
    })
  })

  describe('the "personalMobile" property', () => {
    describe('when the mobile property is missing', () => {
      test('returns "Not added" if mobile is missing', () => {
        data.contact.mobile = null

        const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

        expect(result.personalTelephone.mobile).toBe('Not added')
      })
    })
  })

  describe('the "personalPhoneAction" property', () => {
    describe('when both telephone and mobile properties have values', () => {
      test('it should return the text "Change"', () => {
        data.contact.telephone = '01234567890'
        data.contact.mobile = '07123456789'
        const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

        expect(result.personalTelephone.action).toEqual('Change')
      })
    })

    describe('when only one of the properties has a value', () => {
      test('it should return the text "Change"', () => {
        data.contact.telephone = '01234567890'
        data.contact.mobile = null
        const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

        expect(result.personalTelephone.action).toEqual('Change')
      })
    })

    describe('when both properties are null', () => {
      test('it should return the text "Add"', () => {
        data.contact.telephone = null
        data.contact.mobile = null
        const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

        expect(result.personalTelephone.action).toEqual('Add')
      })
    })
  })

  describe('the "notification" property', () => {
    test('returns null if yar is falsy', () => {
      const result = personalDetailsPresenter(data, null, hasValidPersonalDetails, sectionsNeedingUpdate)

      expect(result.notification).toBe(null)
    })
  })

  describe('the "fullName" property', () => {
    test('returns a formatted full name', () => {
      const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

      expect(result.personalName.fullName).toBe('John M Doe')
    })
  })

  describe('the "personalEmail.email" property', () => {
    describe('when the email property is missing', () => {
      test('it should return the text "Not added"', () => {
        data.contact.email = null
        const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

        expect(result.personalEmail.email).toEqual('Not added')
      })
    })

    describe('when the email property has a value', () => {
      test('it should return the email address', () => {
        data.contact.email = 'test@test.com'
        const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

        expect(result.personalEmail.email).toEqual('test@test.com')
      })
    })
  })

  describe('the "personalEmail.action" property', () => {
    describe('when the personalEmail property is missing', () => {
      test('it should return the text "Add"', () => {
        data.contact.email = null
        const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

        expect(result.personalEmail.action).toEqual('Add')
      })
    })

    describe('when the personalEmail property has a value', () => {
      test('it should return the text "Change"', () => {
        data.contact.email = 'test@test.com'
        const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

        expect(result.personalEmail.action).toEqual('Change')
      })
    })
  })

  describe('the "dob.fullDateOfBirth" property', () => {
    describe('when dateOfBirth is missing', () => {
      test('it should return the text "Not added"', () => {
        delete data.info.dateOfBirth
        const result = personalDetailsPresenter(data, yar)

        expect(result.dob.fullDateOfBirth).toEqual('Not added')
      })
    })

    describe('when dateOfBirth is an invalid date', () => {
      test('it should return the text "Not added"', () => {
        data.info.dateOfBirth = '4000-14-01'
        const result = personalDetailsPresenter(data, yar)

        expect(result.dob.fullDateOfBirth).toEqual('Not added')
      })
    })

    describe('when dateOfBirth has a value', () => {
      test('it should return the formatted date', () => {
        data.info.dateOfBirth = '2000-01-01'
        const result = personalDetailsPresenter(data, yar)

        expect(result.dob.fullDateOfBirth).toEqual('1 January 2000')
      })
    })
  })

  describe('the "dob.action" property', () => {
    describe('when dateOfBirth is missing', () => {
      test('it should return the text "Add"', () => {
        delete data.info.dateOfBirth
        const result = personalDetailsPresenter(data, yar)

        expect(result.dob.action).toEqual('Add')
      })
    })

    describe('when dateOfBirth is an invalid date', () => {
      test('it should return the text "Add"', () => {
        data.info.dateOfBirth = '4000-14-01'
        const result = personalDetailsPresenter(data, yar)

        expect(result.dob.action).toEqual('Add')
      })
    })

    describe('when dateOfBirth has a value', () => {
      test('it should return the text "Change"', () => {
        data.info.dateOfBirth = '2000-01-01'
        const result = personalDetailsPresenter(data, yar)

        expect(result.dob.action).toEqual('Change')
      })
    })
  })

  describe('the change link properties', () => {
    describe('when the personal details interrupter is disabled', () => {
      test('all change links should point to their standard change link', () => {
        const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

        expect(result.personalName.changeLink).toBe('/account-name-change')
        expect(result.personalAddress.changeLink).toBe('/account-address-change')
        expect(result.personalTelephone.changeLink).toBe('/account-phone-numbers-change')
        expect(result.personalEmail.changeLink).toBe('/account-email-change')
        expect(result.dob.changeLink).toBe('/account-date-of-birth-change')
      })
    })

    describe('when the personal details interrupter is enabled', () => {
      beforeEach(() => {
        // Enable the personal details interrupter feature toggle
        config.get.mockReturnValue(true)
      })

      describe('and all details are valid', () => {
        test('all change links should point to their standard change link', () => {
          const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

          expect(result.personalName.changeLink).toBe('/account-name-change')
          expect(result.personalAddress.changeLink).toBe('/account-address-change')
          expect(result.personalTelephone.changeLink).toBe('/account-phone-numbers-change')
          expect(result.personalEmail.changeLink).toBe('/account-email-change')
          expect(result.dob.changeLink).toBe('/account-date-of-birth-change')
        })
      })

      describe('and only one name is invalid', () => {
        beforeEach(() => {
          hasValidPersonalDetails = false
          sectionsNeedingUpdate = ['name']
        })

        test('all links except the name points to the interrupter journey', () => {
          const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

          expect(result.personalName.changeLink).toBe('/account-name-change')
          expect(result.personalAddress.changeLink).toBe('/personal-fix?source=address')
          expect(result.personalTelephone.changeLink).toBe('/personal-fix?source=phone')
          expect(result.personalEmail.changeLink).toBe('/personal-fix?source=email')
          expect(result.dob.changeLink).toBe('/personal-fix?source=dob')
        })
      })

      describe('and only address is invalid', () => {
        beforeEach(() => {
          hasValidPersonalDetails = false
          sectionsNeedingUpdate = ['address']
        })

        test('all links except the address points to the interrupter journey', () => {
          const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

          expect(result.personalName.changeLink).toBe('/personal-fix?source=name')
          expect(result.personalAddress.changeLink).toBe('/account-address-change')
          expect(result.personalTelephone.changeLink).toBe('/personal-fix?source=phone')
          expect(result.personalEmail.changeLink).toBe('/personal-fix?source=email')
          expect(result.dob.changeLink).toBe('/personal-fix?source=dob')
        })
      })

      describe('and only phone number is invalid', () => {
        beforeEach(() => {
          hasValidPersonalDetails = false
          sectionsNeedingUpdate = ['phone']
        })

        test('all links except the phone number points to the interrupter journey', () => {
          const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

          expect(result.personalName.changeLink).toBe('/personal-fix?source=name')
          expect(result.personalAddress.changeLink).toBe('/personal-fix?source=address')
          expect(result.personalTelephone.changeLink).toBe('/account-phone-numbers-change')
          expect(result.personalEmail.changeLink).toBe('/personal-fix?source=email')
          expect(result.dob.changeLink).toBe('/personal-fix?source=dob')
        })
      })

      describe('and only email is invalid', () => {
        beforeEach(() => {
          hasValidPersonalDetails = false
          sectionsNeedingUpdate = ['email']
        })

        test('all links except the email points to the interrupter journey', () => {
          const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

          expect(result.personalName.changeLink).toBe('/personal-fix?source=name')
          expect(result.personalAddress.changeLink).toBe('/personal-fix?source=address')
          expect(result.personalTelephone.changeLink).toBe('/personal-fix?source=phone')
          expect(result.personalEmail.changeLink).toBe('/account-email-change')
          expect(result.dob.changeLink).toBe('/personal-fix?source=dob')
        })
      })

      describe('and only dob is invalid', () => {
        beforeEach(() => {
          hasValidPersonalDetails = false
          sectionsNeedingUpdate = ['dob']
        })

        test('all links except the dob points to the interrupter journey', () => {
          const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

          expect(result.personalName.changeLink).toBe('/personal-fix?source=name')
          expect(result.personalAddress.changeLink).toBe('/personal-fix?source=address')
          expect(result.personalTelephone.changeLink).toBe('/personal-fix?source=phone')
          expect(result.personalEmail.changeLink).toBe('/personal-fix?source=email')
          expect(result.dob.changeLink).toBe('/account-date-of-birth-change')
        })
      })

      describe('when multiple details are invalid', () => {
        beforeEach(() => {
          hasValidPersonalDetails = false
          sectionsNeedingUpdate = ['name', 'address', 'phone', 'email', 'dob']
        })

        test('all links point to the interrupter journey', () => {
          const result = personalDetailsPresenter(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

          expect(result.personalName.changeLink).toBe('/personal-fix?source=name')
          expect(result.personalAddress.changeLink).toBe('/personal-fix?source=address')
          expect(result.personalTelephone.changeLink).toBe('/personal-fix?source=phone')
          expect(result.personalEmail.changeLink).toBe('/personal-fix?source=email')
          expect(result.dob.changeLink).toBe('/personal-fix?source=dob')
        })
      })
    })
  })
})
