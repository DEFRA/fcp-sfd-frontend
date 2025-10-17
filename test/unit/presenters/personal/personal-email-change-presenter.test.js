// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalEmailChangePresenter } from '../../../../src/presenters/personal/personal-email-change-presenter.js'

describe('personalEmailChangePresenter', () => {
  let data
  let payload

  beforeEach(() => {
    data = {
      info: {
        fullName: {
          fullNameJoined: 'Alfred Waldron'
        }
      },
      contact: {
        email: 'test@test.com'
      }
    }
  })

  describe('when provided with personal email change data', () => {
    test('it correctly presents the data', () => {
      const result = personalEmailChangePresenter(data)

      expect(result).toEqual({
        backLink: { href: '/personal-details' },
        pageTitle: 'What is your personal email address?',
        metaDescription: 'Update the email address for your personal account.',
        userName: 'Alfred Waldron',
        personalEmail: 'test@test.com'
      })
    })
  })

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete data.info.fullName.fullNameJoined
      })

      test('it should return userName as null', () => {
        const result = personalEmailChangePresenter(data)

        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "personalEmail" property', () => {
    describe('when provided with a changed personal email', () => {
      beforeEach(() => {
        data.changePersonalEmail = 'new-email@test.com'
      })

      test('it should return the changed personal email as the personalEmail', () => {
        const result = personalEmailChangePresenter(data)

        expect(result.personalEmail).toEqual('new-email@test.com')
      })
    })

    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = 'even-newer-email@test.com'
      })

      test('it should return the payload as the personalEmail', () => {
        const result = personalEmailChangePresenter(data, payload)

        expect(result.personalEmail).toEqual('even-newer-email@test.com')
      })
    })
  })
})
