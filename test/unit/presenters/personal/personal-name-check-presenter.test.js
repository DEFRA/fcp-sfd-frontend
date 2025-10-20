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
      },
      changePersonalName: {
        first: 'John',
        middle: 'A',
        last: 'Doe'
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
        fullName: 'John A Doe'
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
          first: 'Jane',
          middle: '',
          last: 'Smith'
        }
      })

      test('it should return fullName without middle name', () => {
        const result = personalNameCheckPresenter(data)

        expect(result.fullName).toEqual('Jane Smith')
      })
    })

    describe('when provided with a name that has undefined middle name', () => {
      beforeEach(() => {
        data.changePersonalName = {
          first: 'Bob',
          middle: undefined,
          last: 'Johnson'
        }
      })

      test('it should return fullName without middle name', () => {
        const result = personalNameCheckPresenter(data)

        expect(result.fullName).toEqual('Bob Johnson')
      })
    })

    describe('when provided with a name that has null middle name', () => {
      beforeEach(() => {
        data.changePersonalName = {
          first: 'Alice',
          middle: null,
          last: 'Brown'
        }
      })

      test('it should return fullName without middle name', () => {
        const result = personalNameCheckPresenter(data)

        expect(result.fullName).toEqual('Alice Brown')
      })
    })

    describe('when changePersonalName is present', () => {
      test('it should use changePersonalName over info.fullName', () => {
        const result = personalNameCheckPresenter(data)

        expect(result.fullName).toEqual('John A Doe')
      })
    })

    describe('when changePersonalName is missing', () => {
      beforeEach(() => {
        delete data.changePersonalName
      })

      test('it should fallback to info.fullName', () => {
        const result = personalNameCheckPresenter(data)

        expect(result.fullName).toEqual('Alfred M Waldron')
      })
    })

    describe('when changePersonalName is null', () => {
      beforeEach(() => {
        data.changePersonalName = null
      })

      test('it should fallback to info.fullName', () => {
        const result = personalNameCheckPresenter(data)

        expect(result.fullName).toEqual('Alfred M Waldron')
      })
    })

    describe('when changePersonalName is undefined', () => {
      beforeEach(() => {
        data.changePersonalName = undefined
      })

      test('it should fallback to info.fullName', () => {
        const result = personalNameCheckPresenter(data)

        expect(result.fullName).toEqual('Alfred M Waldron')
      })
    })
  })
})
