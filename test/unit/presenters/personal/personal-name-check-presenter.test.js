// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalNameCheckPresenter } from '../../../../src/presenters/personal/personal-name-check-presenter.js'

describe('personalNameCheckPresenter', () => {
  let data

  beforeEach(() => {
    data = {
      info: {
        fullName: {
          first: 'Alfred',
          middle: 'M',
          last: 'Waldron',
          fullNameJoined: 'Alfred M Waldron'
        }
      }
    }
  })

  describe('when provided with personal name check data', () => {
    test('it correctly presents the data', () => {
      const result = personalNameCheckPresenter(data)

      expect(result).toEqual({
        backLink: { href: '/account-name-change' },
        changeLink: '/account-name-change',
        pageTitle: 'Check your name is correct before submitting',
        metaDescription: 'Check the full name for your personal account is correct.',
        userName: 'Alfred M Waldron',
        fullName: 'Alfred M Waldron'
      })
    })
  })

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete data.info.fullName.fullNameJoined
      })

      test('it should return userName as null', () => {
        const result = personalNameCheckPresenter(data)

        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "fullName" property', () => {
    describe('when provided with a name that has no middle name', () => {
      beforeEach(() => {
        data.changePersonalName = {
          first: 'Alfred',
          middle: '',
          last: 'Waldron'
        }
      })

      test('it should return fullName without middle name', () => {
        const result = personalNameCheckPresenter(data)

        expect(result.fullName).toEqual('Alfred Waldron')
      })
    })

    describe('when provided with a changed personal name', () => {
      beforeEach(() => {
        data.changePersonalName = {
          first: 'John',
          middle: 'A',
          last: 'Doe'
        }
      })

      test('it should return fullName as the changed name', () => {
        const result = personalNameCheckPresenter(data)

        expect(result.fullName).toEqual('John A Doe')
      })
    })

    describe('when changePersonalName is missing', () => {
      beforeEach(() => {
        delete data.changePersonalName
      })

      test('it should return fullName', () => {
        const result = personalNameCheckPresenter(data)

        expect(result.fullName).toEqual('Alfred M Waldron')
      })
    })
  })
})
