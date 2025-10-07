// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalDobCheckPresenter } from '../../../../src/presenters/personal/personal-dob-check-presenter'

describe('personalDobCheckPresenter', () => {
  let data

  beforeEach(() => {
    data = {
      info: {
        dateOfBirth: '1990-05-01'
      },
      changePersonalDob: { day: '25', month: '06', year: '1984' }
    }
  })

  describe('when provided with changePersonalDob', () => {
    test('it correctly presents the data', () => {
      const result = personalDobCheckPresenter(data)

      expect(result).toEqual({
        backLink: { href: '/personal-dob-change' },
        changeLink: '/personal-dob-change',
        pageTitle: 'Check your date of birth is correct before submitting',
        metaDescription: 'Check the date of birth for your personal account are correct.',
        dobText: '25 June 1984'
      })
    })
  })
})
