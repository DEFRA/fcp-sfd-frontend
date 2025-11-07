// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalEmailCheckPresenter } from '../../../../src/presenters/personal/personal-email-check-presenter.js'

describe('personalEmailCheckPresenter', () => {
  let data

  beforeEach(() => {
    data = {
      info: {
        fullName: {
          first: 'Alfred',
          last: 'Waldron'
        }
      },
      contact: {
        email: 'test@test.com'
      }
    }
  })

  describe('when provided with personal email check data', () => {
    test('it correctly presents the data', () => {
      const result = personalEmailCheckPresenter(data)

      expect(result).toEqual({
        backLink: { href: '/account-email-change' },
        changeLink: '/account-email-change',
        pageTitle: 'Check your personal email address is correct before submitting',
        metaDescription: 'Check the email address for your personal account is correct.',
        userName: 'Alfred Waldron',
        personalEmail: 'test@test.com'
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
        const result = personalEmailCheckPresenter(data)

        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "personalEmail" property', () => {
    describe('when provided with a changed personal email', () => {
      beforeEach(() => {
        data.changePersonalEmail = 'new-email@new-email.com'
      })
      test('it should return the changed personal email as the personalEmail', () => {
        const result = personalEmailCheckPresenter(data)

        expect(result.personalEmail).toEqual('new-email@new-email.com')
      })
    })
  })
})
