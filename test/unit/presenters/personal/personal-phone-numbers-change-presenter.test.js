// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalPhoneNumbersChangePresenter } from '../../../../src/presenters/personal/personal-phone-numbers-change-presenter.js'

describe('personalPhoneNumbersChangePresenter', () => {
  let data
  let payload

  beforeEach(() => {
    data = {
      info: {
        fullName: {
          first: 'Alfred',
          last: 'Waldron'
        }
      },
      contact: {
        telephone: '01234 567891',
        mobile: null
      },
      changePersonalPhoneNumbers: {}
    }
  })

  describe('when provided with personal phone numbers change data', () => {
    test('it correctly presents the data', () => {
      const result = personalPhoneNumbersChangePresenter(data)

      expect(result).toEqual({
        backLink: { href: '/personal-details' },
        pageTitle: 'What are your personal phone numbers?',
        metaDescription: 'Update the phone numbers for your personal account.',
        userName: 'Alfred Waldron',
        personalTelephone: '01234 567891',
        personalMobile: null
      })
    })
  })

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete data.info.fullName.first
        delete data.info.fullName.last
      })

      test('it should return userName as null', () => {
        const result = personalPhoneNumbersChangePresenter(data)

        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "personalMobile" property', () => {
    describe('when provided with a changed personalMobile', () => {
      beforeEach(() => {
        data.changePersonalPhoneNumbers.personalMobile = '01111 111111'
      })

      test('it should return personalMobile as the changed personalMobile', () => {
        const result = personalPhoneNumbersChangePresenter(data)

        expect(result.personalMobile).toEqual('01111 111111')
      })
    })

    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = { personalMobile: '01234 111111' }
      })

      test('it should return personalMobile as the payload', () => {
        const result = personalPhoneNumbersChangePresenter(data, payload)

        expect(result.personalMobile).toEqual('01234 111111')
      })
    })
  })

  describe('the "personalTelephone" property', () => {
    describe('when provided with a changed personalTelephone', () => {
      beforeEach(() => {
        data.changePersonalPhoneNumbers.personalTelephone = '01214 151151'
      })

      test('it should return personalTelephone as the changed personalTelephone', () => {
        const result = personalPhoneNumbersChangePresenter(data)

        expect(result.personalTelephone).toEqual('01214 151151')
      })
    })

    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = { personalTelephone: '02222 222222' }
      })

      test('it should return personalTelephone as the payload', () => {
        const result = personalPhoneNumbersChangePresenter(data, payload)

        expect(result.personalTelephone).toEqual('02222 222222')
      })
    })
  })
})
