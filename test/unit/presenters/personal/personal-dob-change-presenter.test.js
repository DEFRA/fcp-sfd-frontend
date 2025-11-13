// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalDobChangePresenter } from '../../../../src/presenters/personal/personal-dob-change-presenter'

describe('personalDobChangePresenter', () => {
  let data
  let payload

  beforeEach(() => {
    data = {
      info: {
        dateOfBirth: '1990-05-01',
        userName: 'Alfred Waldron',
        fullName: {
          first: 'Alfred',
          last: 'Waldron'
        }
      }
    }
  })

  describe('when provided with personal date of birth data', () => {
    test('it correctly presents the data', () => {
      const result = personalDobChangePresenter(data)

      expect(result).toEqual({
        backLink: { href: '/personal-details' },
        pageTitle: 'What is your date of birth?',
        userName: 'Alfred Waldron',
        hint: 'For example, 31 3 1980',
        metaDescription: 'Update the date of birth for your personal account.',
        day: '1',
        month: '5',
        year: '1990'
      })
    })
  })

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete data.info.userName
      })

      test('it should return userName as null', () => {
        const result = personalDobChangePresenter(data)

        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "day", "month" and "year" property', () => {
    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = { day: '20', month: '10', year: '1997' }
      })

      test('it should return the day, month and year from the payload', () => {
        const result = personalDobChangePresenter(data, payload)

        expect(result.day).toEqual('20')
        expect(result.month).toEqual('10')
        expect(result.year).toEqual('1997')
      })
    })

    describe('when provided with a empty payload', () => {
      beforeEach(() => {
        payload = {}
      })

      test('it should return the day, month and year from the payload', () => {
        const result = personalDobChangePresenter(data, payload)

        expect(result.day).toEqual('')
        expect(result.month).toEqual('')
        expect(result.year).toEqual('')
      })
    })

    describe('when provided with a changed personal date of birth', () => {
      beforeEach(() => {
        data.changePersonalDob = { day: '15', month: '11', year: '2000' }
      })

      test('it should return the day, month and year from the changePersonalDob object', () => {
        const result = personalDobChangePresenter(data)

        expect(result.day).toEqual('15')
        expect(result.month).toEqual('11')
        expect(result.year).toEqual('2000')
      })
    })

    describe('when no payload and no changed dates are provided', () => {
      beforeEach(() => {
        delete data.changePersonalDob
      })

      test('it should return the day, month and year from the original date object', () => {
        const result = personalDobChangePresenter(data)

        expect(result.day).toEqual('1')
        expect(result.month).toEqual('5')
        expect(result.year).toEqual('1990')
      })
    })
  })
})
