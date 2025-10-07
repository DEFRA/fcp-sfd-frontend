// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalDobChangePresenter } from '../../../../src/presenters/personal/personal-dob-change-presenter'

describe('personalDobChangePresenter', () => {
  let data

  beforeEach(() => {
    data = {
      info: {
        dateOfBirth: '1990-05-01'
      }
    }
  })

  describe('when provided with personal date of birth in info object only', () => {
    test('it correctly presents the data', () => {
      const result = personalDobChangePresenter(data)

      expect(result).toEqual({
        backLink: { href: '/personal-details' },
        pageTitle: 'What is your date of birth?',
        metaDescription: 'For example, 31 3 1980',
        dobDay: 1,
        dobMonth: 5,
        dobYear: 1990
      })
    })
  })

  describe('when provided with personal date of birth in info object and changePersonalDob ', () => {
    test('it correctly presents the data', () => {
      data.changePersonalDob = { day: '25', month: '06', year: '1984' }
      const result = personalDobChangePresenter(data)

      expect(result).toEqual({
        backLink: { href: '/personal-details' },
        pageTitle: 'What is your date of birth?',
        metaDescription: 'For example, 31 3 1980',
        dobDay: '25',
        dobMonth: '06',
        dobYear: '1984'
      })
    })
  })
})
