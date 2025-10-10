// Test framework dependencies
import { describe, test, expect } from 'vitest'

// Thing under test
import { formatDateValidationErrors } from '../../../src/utils/format-date-validation-errors'

describe('formatDateValidationErrors', () => {
  test('it should return "Date of birth must be a real date" when all of day, month and year are invalid', () => {
    const errors = [{ path: ['day'], message: 'Anything' }, { path: ['month'], message: 'Anything' }, { path: ['year'], message: 'Anything' }]
    const result = formatDateValidationErrors(errors)
    expect(result.dateError).toEqual('Date of birth must be a real date')
  })

  test('it should return "Invalid date" as default value', () => {
    const errors = [{ path: ['default'], message: 'Anything' }]
    const result = formatDateValidationErrors(errors)
    expect(result.dateError).toEqual('Invalid date')
  })
  describe('when not all of day, month and year are invalid', () => {
    test('it should return "Date of birth must be a date in the past" when any error object has the message ', () => {
      const errors = [{ path: ['day'], message: 'Anything' }, { path: ['month'], message: 'Date of birth must be a date in the past' }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must be a date in the past')
    })

    test('it should return "Date of birth must include valid day and month" when day and month are invalid', () => {
      const errors = [{ path: ['day'], message: 'Anything' }, { path: ['month'], message: 'Anything' }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must include valid day and month')
    })

    test('it should return "Date of birth must include valid month and year" when month and year are invalid', () => {
      const errors = [{ path: ['year'], message: 'Anything' }, { path: ['month'], message: 'Anything' }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must include valid month and year')
    })

    test('it should return "Date of birth must include valid day and year" when day and year are invalid', () => {
      const errors = [{ path: ['year'], message: 'Anything' }, { path: ['day'], message: 'Anything' }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must include valid day and year')
    })

    test('it should return "Date of birth must include valid day" when only day is invalid', () => {
      const errors = [{ path: ['day'], message: 'Anything' }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must include valid day')
    })

    test('it should return "Date of birth must include valid month" when only month is invalid', () => {
      const errors = [{ path: ['month'], message: 'Anything' }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must include valid month')
    })

    test('it should return "Date of birth must include valid year" when only year is invalid', () => {
      const errors = [{ path: ['year'], message: 'Anything' }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must include valid year')
    })
  })
})
