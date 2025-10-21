// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalNameChangePresenter } from '../../../../src/presenters/personal/personal-name-change-presenter.js'

describe('personalNameChangePresenter', () => {
  let data
  let payload

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
      changePersonalName: {}
    }
    payload = {}
  })

  describe('when provided with personal name change data', () => {
    test('it correctly presents the data', () => {
      const result = personalNameChangePresenter(data)

      expect(result).toEqual({
        backLink: { href: '/personal-details' },
        pageTitle: 'What is your full name?',
        metaDescription: 'Update the full name for your personal account.',
        userName: 'Alfred M Waldron',
        first: 'Alfred',
        middle: 'M',
        last: 'Waldron'
      })
    })
  })

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete data.info.fullName.fullNameJoined
      })

      test('it should return userName as null', () => {
        const result = personalNameChangePresenter(data)
        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "first" property', () => {
    describe('when provided with a changed first name', () => {
      beforeEach(() => {
        data.changePersonalName.first = 'John'
      })

      test('it should return first as the changed first name', () => {
        const result = personalNameChangePresenter(data)

        expect(result.first).toEqual('John')
      })
    })

    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = { first: 'Jane' }
      })

      test('it should return first as the payload', () => {
        const result = personalNameChangePresenter(data, payload)

        expect(result.first).toEqual('Jane')
      })
    })

    describe('when payload is provided alongside changePersonalName', () => {
      beforeEach(() => {
        data.changePersonalName.first = 'ChangeFirst'
        payload = { first: 'PayloadFirst' }
      })

      test('it should return first as the payload', () => {
        const result = personalNameChangePresenter(data, payload)

        expect(result.first).toEqual('PayloadFirst')
      })
    })
  })

  describe('the "middle" property', () => {
    describe('when provided with a changed middle name', () => {
      beforeEach(() => {
        data.changePersonalName.middle = 'A'
      })

      test('it should return middle as the changed middle name', () => {
        const result = personalNameChangePresenter(data)

        expect(result.middle).toEqual('A')
      })
    })

    describe('when payload is provided alongside changePersonalName', () => {
      beforeEach(() => {
        data.changePersonalName.middle = 'C'
        payload = { middle: 'P' }
      })

      test('it should return middle as the payload', () => {
        const result = personalNameChangePresenter(data, payload)

        expect(result.middle).toEqual('P')
      })
    })

    describe('when provided with a payload with empty middle name', () => {
      beforeEach(() => {
        payload = { middle: '' }
      })

      test('it should return middle as empty string', () => {
        const result = personalNameChangePresenter(data, payload)

        expect(result.middle).toEqual('')
      })
    })
  })

  describe('the "last" property', () => {
    describe('when provided with a changed last name', () => {
      beforeEach(() => {
        data.changePersonalName.last = 'Smith'
      })

      test('it should return last as the changed last name', () => {
        const result = personalNameChangePresenter(data)

        expect(result.last).toEqual('Smith')
      })
    })

    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = { last: 'Johnson' }
      })

      test('it should return last as the payload', () => {
        const result = personalNameChangePresenter(data, payload)

        expect(result.last).toEqual('Johnson')
      })
    })

    describe('when payload is provided alongside changePersonalName', () => {
      beforeEach(() => {
        data.changePersonalName.last = 'ChangeLast'
        payload = { last: 'PayloadLast' }
      })

      test('it should return last as the payload', () => {
        const result = personalNameChangePresenter(data, payload)

        expect(result.last).toEqual('PayloadLast')
      })
    })
  })
})
