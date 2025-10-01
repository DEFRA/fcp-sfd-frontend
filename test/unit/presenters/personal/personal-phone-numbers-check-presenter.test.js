// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalPhoneNumbersCheckPresenter } from '../../../../src/presenters/personal/personal-phone-numbers-check-presenter.js'

describe('personalPhoneNumbersCheckPresenter', () => {
  let data

  beforeEach(() => {
    data = {
      info: {
        fullName: {
          fullNameJoined: 'John Doe'
        }
      },
      contact: {
        telephone: '01234567890',
        mobile: null
      },
      changePersonalPhoneNumbers: {
        personalTelephone: '01234567890',
        personalMobile: null
      }
    }
  })

  describe('when provided with personal phone numbers check data', () => {
    test('it correctly presents the data', () => {
      const result = personalPhoneNumbersCheckPresenter(data)

      expect(result).toEqual({
        backLink: { href: '/account-phone-numbers-change' },
        changeLink: '/account-phone-numbers-change',
        pageTitle: 'Check your personal phone numbers are correct before submitting',
        metaDescription: 'Check the phone numbers for your personal account are correct.',
        userName: 'John Doe',
        personalTelephone: {
          telephone: '01234567890',
          mobile: 'Not added'
        }
      })
    })
  })

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete data.info.fullName.fullNameJoined
      })

      test('it should return userName as null', () => {
        const result = personalPhoneNumbersCheckPresenter(data)

        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "personalTelephone" property', () => {
    describe('when the personalTelephone property is missing', () => {
      beforeEach(() => {
        delete data.changePersonalPhoneNumbers.personalTelephone
      })

      test('it should return personalTelephone as "Not added"', () => {
        const result = personalPhoneNumbersCheckPresenter(data)

        expect(result.personalTelephone.telephone).toEqual('Not added')
      })
    })
  })

  describe('the "personalMobile" property', () => {
    describe('when the personalMobile property is missing', () => {
      beforeEach(() => {
        delete data.changePersonalPhoneNumbers.personalMobile
      })

      test('it should return personalMobile as "Not added"', () => {
        const result = personalPhoneNumbersCheckPresenter(data)

        expect(result.personalTelephone.mobile).toEqual('Not added')
      })
    })
  })
})
