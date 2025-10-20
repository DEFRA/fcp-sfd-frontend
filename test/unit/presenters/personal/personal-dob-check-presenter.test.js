// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalDobCheckPresenter } from '../../../../src/presenters/personal/personal-dob-check-presenter'

describe('personalDobCheckPresenter', () => {
  let data

  beforeEach(() => {
    data = {
      info: {
        dateOfBirth: '1990-05-01',
        fullName: {
          fullNameJoined: 'Alfred Waldron'
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

  test('it should return userName as null when data does not have info.fullName.fullNameJoined', () => {
    delete data.info.fullName.fullNameJoined
    const result = personalDobCheckPresenter(data)

    expect(result.userName).toEqual(null)
  })
})
