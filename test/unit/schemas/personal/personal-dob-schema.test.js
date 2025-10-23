// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalDobSchema } from '../../../../src/schemas/personal/personal-dob-schema.js'

describe('personal date of birth schema', () => {
  let payload
  let schema

  beforeEach(() => {
    schema = personalDobSchema

    payload = {
      day: '12',
      month: '5',
      year: '1990'
    }
  })

  describe('when valid data is provided', () => {
    test('it confirms the data is valid', () => {
      const { error, value } = schema.validate(payload, { abortEarly: false })

      expect(error).toBeUndefined()
      expect(value).toEqual(payload)
    })
  })

  describe('when the month has been entered as a string', () => {
    beforeEach(() => {
      payload = {
        day: '12',
        month: 'october',
        year: '1990'
      }
    })

    test('it confirms the data is valid', () => {
      const { error, value } = schema.validate(payload, { abortEarly: false })

      expect(error).toBeUndefined()
      expect(value).toEqual(payload)
    })
  })

  describe('when the month has been entered as a string abbreviation', () => {
    beforeEach(() => {
      payload = {
        day: '12',
        month: 'sept',
        year: '1990'
      }
    })

    test('it confirms the data is valid', () => {
      const { error, value } = schema.validate(payload, { abortEarly: false })

      expect(error).toBeUndefined()
      expect(value).toEqual(payload)
    })
  })

  describe('when invalid data is provided', () => {
    describe('because all fields are missing', () => {
      beforeEach(() => {
        payload = { day: '', month: '', year: '' }
      })

      test('it fails validation', () => {
        const { error } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter your date of birth',
          path: ['day', 'month', 'year'],
          type: 'dob.missingAll'
        }))
      })
    })

    describe('because the day is missing', () => {
      beforeEach(() => {
        payload.day = ''
      })

      test('it fails validation', () => {
        const { error } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Date of birth must include a day',
          path: ['day'],
          type: 'dob.missingDay'
        }))
      })
    })

    describe('because the month is missing', () => {
      beforeEach(() => {
        payload.month = ''
      })

      test('it fails validation', () => {
        const { error } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Date of birth must include a month',
          path: ['month'],
          type: 'dob.missingMonth'
        }))
      })
    })

    describe('because the year is missing', () => {
      beforeEach(() => {
        payload.year = ''
      })

      test('it fails validation', () => {
        const { error } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Date of birth must include a year',
          path: ['year'],
          type: 'dob.missingYear'
        }))
      })
    })

    describe('because the year is not 4 digits', () => {
      beforeEach(() => {
        payload.year = '99'
      })

      test('it fails validation', () => {
        const { error } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter a year with 4 numbers, like 1975',
          path: ['year'],
          type: 'dob.yearLength'
        }))
      })
    })

    describe('because the date is not real (31st Feb)', () => {
      beforeEach(() => {
        payload.day = '31'
        payload.month = '2'
        payload.year = '2000'
      })

      test('it fails validation', () => {
        const { error } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Date of birth must be a real date',
          path: ['day', 'month', 'year'],
          type: 'dob.invalid'
        }))
      })
    })

    describe('because the date is in the future', () => {
      beforeEach(() => {
        const nextYear = new Date().getFullYear() + 1
        payload.day = '1'
        payload.month = '1'
        payload.year = String(nextYear)
      })

      test('it fails validation', () => {
        const { error } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Date of birth must be in the past',
          path: ['day', 'month', 'year'],
          type: 'dob.future'
        }))
      })
    })

    describe('because only day is provided', () => {
      beforeEach(() => {
        payload = { day: '5', month: '', year: '' }
      })

      test('it fails validation', () => {
        const { error } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Date of birth must include a month and year',
          path: ['month', 'year'],
          type: 'dob.missingMonthYear'
        }))
      })
    })

    describe('because day and month are missing but year is provided', () => {
      beforeEach(() => {
        payload = { day: '', month: '', year: '2001' }
      })

      test('it fails validation', () => {
        const { error } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Date of birth must include a day and month',
          path: ['day', 'month'],
          type: 'dob.missingDayMonth'
        }))
      })
    })

    describe('because the day and year are missing but month is provided', () => {
      beforeEach(() => {
        payload = { day: '', month: '5', year: '' }
      })

      test('it fails validation', () => {
        const { error } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Date of birth must include a day and year',
          path: ['day', 'year'],
          type: 'dob.missingDayYear'
        }))
      })
    })

    describe('because the date is more than 120 years in the past', () => {
      beforeEach(() => {
        payload = { day: '01', month: '5', year: '1900' }
      })

      test('it fails validation', () => {
        const { error } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: expect.stringContaining('Date of birth must be on or after'),
          path: ['day', 'month', 'year'],
          type: 'dob.tooOld'
        }))
      })
    })

    describe('because the month entered is not in the correct format', () => {
      beforeEach(() => {
        payload = { day: '01', month: 'Ju', year: '1900' }
      })

      test('it fails validation', () => {
        const { error } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: expect.stringContaining('Date of birth must be a real date'),
          path: ['month'],
          type: 'dob.invalid'
        }))
      })
    })
  })
})
