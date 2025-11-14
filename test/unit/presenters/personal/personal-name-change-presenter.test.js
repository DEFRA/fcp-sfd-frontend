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
        userName: 'Alfred Waldron',
        fullName: {
          first: 'Alfred',
          middle: 'M',
          last: 'Waldron'
        }
      },
      changePersonalName: {}
    }
  })

  describe('when provided with personal name change data', () => {
    test('it correctly presents the data', () => {
      const result = personalNameChangePresenter(data)

      expect(result).toEqual({
        backLink: { href: '/personal-details' },
        pageTitle: 'What is your full name?',
        metaDescription: 'Update the full name for your personal account.',
        userName: 'Alfred Waldron',
        first: 'Alfred',
        middle: 'M',
        last: 'Waldron'
      })
    })
  })

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete data.info.userName
      })

      test('it should return userName as null', () => {
        const result = personalNameChangePresenter(data)
        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "first" property', () => {
    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = { first: 'Jane' }
      })

      test('it should return the payload as the first property', () => {
        const result = personalNameChangePresenter(data, payload)

        expect(result.first).toEqual('Jane')
      })
    })

    describe('when no payload is provided but a changed first name', () => {
      beforeEach(() => {
        data.changePersonalName.first = 'John'
      })

      test('it should return the changed name as the first property', () => {
        const result = personalNameChangePresenter(data)

        expect(result.first).toEqual('John')
      })
    })

    describe('when no payload and no changed name is provided', () => {
      beforeEach(() => {
        delete data.changePersonalName.first
        payload = {}
      })

      test('it should default to the original first name', () => {
        const result = personalNameChangePresenter(data, payload)

        expect(result.first).toEqual('Alfred')
      })
    })
  })

  describe('the "middle" property', () => {
    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = { middle: 'P' }
      })

      test('it should return the payload as the middle property', () => {
        const result = personalNameChangePresenter(data, payload)

        expect(result.middle).toEqual('P')
      })
    })
    describe('when no payload is provided but a changed middle names', () => {
      beforeEach(() => {
        data.changePersonalName.middle = 'A'
      })

      test('it should return the changed name as the middle property', () => {
        const result = personalNameChangePresenter(data)

        expect(result.middle).toEqual('A')
      })
    })

    describe('when no payload and no changed name is provided', () => {
      beforeEach(() => {
        delete data.changePersonalName.middle
        payload = {}
      })

      test('it should default to the original middle names', () => {
        const result = personalNameChangePresenter(data, payload)

        expect(result.middle).toEqual('M')
      })
    })
  })

  describe('the "last" property', () => {
    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = { last: 'Johnson' }
      })

      test('it should return last as the payload', () => {
        const result = personalNameChangePresenter(data, payload)

        expect(result.last).toEqual('Johnson')
      })
    })

    describe('when no payload is provided but a changed last name', () => {
      beforeEach(() => {
        data.changePersonalName.last = 'Smith'
      })

      test('it should return the changed name as the last property', () => {
        const result = personalNameChangePresenter(data)

        expect(result.last).toEqual('Smith')
      })
    })

    describe('when no payload and no changed name is provided', () => {
      beforeEach(() => {
        delete data.changePersonalName.last
        payload = {}
      })

      test('it should default to the original last name', () => {
        const result = personalNameChangePresenter(data, payload)

        expect(result.last).toEqual('Waldron')
      })
    })
  })
})
