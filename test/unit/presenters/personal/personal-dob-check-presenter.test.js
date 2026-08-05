// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalDobCheckPresenter } from '../../../../src/presenters/personal/personal-dob-check-presenter.js'

describe('personalDobCheckPresenter', () => {
  let data

  beforeEach(() => {
    data = {
      info: {
        dateOfBirth: {
          full: '1990-05-01',
          day: '1',
          month: '5',
          year: '1990'
        },
        userName: 'Alfred Waldron',
        fullName: {
          first: 'Alfred',
          last: 'Waldron'
        }
      },
      changePersonalDob: { day: '25', month: '06', year: '1984' }
    }
  })

  describe('when provided with changePersonalDob', () => {
    test('it correctly presents the data', () => {
      const result = personalDobCheckPresenter(data)

      expect(result).toEqual({
        backLink: { href: '/account-date-of-birth-change' },
        userName: 'Alfred Waldron',
        changeLink: '/account-date-of-birth-change',
        pageTitle: 'Check your date of birth is correct before submitting',
        metaDescription: 'Check the date of birth for your personal account is correct.',
        dateOfBirth: '25 June 1984'
      })
    })
  })

  describe('when there is no changePersonalDob', () => {
    beforeEach(() => {
      delete data.changePersonalDob
    })

    test('it falls back to the date of birth from the DAL', () => {
      const result = personalDobCheckPresenter(data)

      expect(result.dateOfBirth).toEqual('1 May 1990')
    })
  })

  describe('when the year is not 4 digits', () => {
    beforeEach(() => {
      data.changePersonalDob = { day: '25', month: '06', year: '33' }
    })

    test('it does not interpret the year as 2033', () => {
      const result = personalDobCheckPresenter(data)

      expect(result.dateOfBirth).toEqual('25 June 33')
    })
  })

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete data.info.userName
      })

      test('it should return userName as null', () => {
        const result = personalDobCheckPresenter(data)

        expect(result.userName).toBeNull()
      })
    })
  })

  describe('when there is no changePersonalDob in the session', () => {
    beforeEach(() => {
      delete data.changePersonalDob
      data.info.dateOfBirth = { day: '01', month: '05', year: '1990' }
    })

    test('it falls back to the date of birth on record', () => {
      const result = personalDobCheckPresenter(data)

      expect(result.dateOfBirth).toEqual('1 May 1990')
    })

    test('it returns null if date of birth on record is incomplete', () => {
      data.info.dateOfBirth = { day: null, month: '05', year: '1990' }

      const result = personalDobCheckPresenter(data)

      expect(result.dateOfBirth).toBeNull()
    })

    test('it returns null if date of birth on record is missing', () => {
      delete data.info.dateOfBirth

      const result = personalDobCheckPresenter(data)

      expect(result.dateOfBirth).toBeNull()
    })
  })
})
