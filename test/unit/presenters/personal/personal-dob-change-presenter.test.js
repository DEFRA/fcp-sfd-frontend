// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalDobChangePresenter } from '../../../../src/presenters/personal/personal-dob-change-presenter'

describe('personalDobChangePresenter', () => {
  let data

  beforeEach(() => {
    data = {
      info: {
        dateOfBirth: '1990-05-01',
        fullName: {
          fullNameJoined: 'Alfred Waldron'
        }
      }
    }
  })

  describe('when provided with personal date of birth in info object only', () => {
    test('it correctly presents the data', () => {
      const result = personalDobChangePresenter(data)

      expect(result).toEqual({
        backLink: { href: '/personal-details' },
        pageTitle: 'What is your date of birth?',
        userName: 'Alfred Waldron',
        hint: 'For example, 31 3 1980',
        metaDescription: 'Update the date of birth for your personal account.',
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
        userName: 'Alfred Waldron',
        hint: 'For example, 31 3 1980',
        metaDescription: 'Update the date of birth for your personal account.',
        dobDay: '25',
        dobMonth: '06',
        dobYear: '1984'
      })
    })
  })

  describe('when provided with payload ', () => {
    test('it correctly presents payload property as input value when property is not null', () => {
      const payload = { day: '20', month: '4', year: '1979' }
      const result = personalDobChangePresenter(data, payload)

      expect(result).toEqual({
        backLink: { href: '/personal-details' },
        pageTitle: 'What is your date of birth?',
        userName: 'Alfred Waldron',
        hint: 'For example, 31 3 1980',
        metaDescription: 'Update the date of birth for your personal account.',
        dobDay: '20',
        dobMonth: '4',
        dobYear: '1979'
      })
    })

    test('it correctly presents empty string as input value when payload property is null', () => {
      const payload = {}
      const result = personalDobChangePresenter(data, payload)

      expect(result).toEqual({
        backLink: { href: '/personal-details' },
        pageTitle: 'What is your date of birth?',
        userName: 'Alfred Waldron',
        hint: 'For example, 31 3 1980',
        metaDescription: 'Update the date of birth for your personal account.',
        dobDay: '',
        dobMonth: '',
        dobYear: ''
      })
    })
  })

  test('it should return userName as null when data does not have info.fullName.fullNameJoined', () => {
    delete data.info.fullName.fullNameJoined
    const result = personalDobChangePresenter(data)

    expect(result.userName).toEqual(null)
  })
})
