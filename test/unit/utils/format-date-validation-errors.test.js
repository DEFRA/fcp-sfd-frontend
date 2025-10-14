// Test framework dependencies
import { describe, test, expect } from 'vitest'

// Thing under test
import { formatDateValidationErrors } from '../../../src/utils/format-date-validation-errors'

describe('formatDateValidationErrors', () => {
  test('it should return "Date of birth must be a real date" when all of day, month and year are invalid', () => {
    const errors = [
      { path: ['day'], message: 'Anything', context: { value: 'anything' } },
      { path: ['month'], message: 'Anything', context: { value: 'anything' } },
      { path: ['year'], message: 'Anything', context: { value: 'anything' } }]
    const result = formatDateValidationErrors(errors)
    expect(result.dateError).toEqual('Date of birth must be a real date')
  })
  test('it should return "Enter your date of birth" when all of day, month and year are empty', () => {
    const errors = [
      { path: ['day'], message: 'Anything', context: { value: '' } },
      { path: ['month'], message: 'Anything', context: { value: '' } },
      { path: ['year'], message: 'Anything', context: { value: '' } }]
    const result = formatDateValidationErrors(errors)
    expect(result.dateError).toEqual('Enter your date of birth')
  })

  test('it should return "Date of birth must be a real date" as default value', () => {
    const errors = [{ path: ['default'], message: 'Anything', context: { value: 'anything' } }]
    const result = formatDateValidationErrors(errors)
    expect(result.dateError).toEqual('Date of birth must be a real date')
  })
  describe('when not all of day, month and year are invalid', () => {
    test('it should return "Date of birth must be in the past" when any error object has the message ', () => {
      const errors = [
        { path: ['day'], message: 'Anything', context: { value: 'anything' } },
        { path: ['month'], message: 'Date of birth must be in the past', context: { value: 'anything' } }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must be in the past')
    })

    test('it should return "Date of birth must be a real date" when day and month are invalid', () => {
      const errors = [
        { path: ['day'], message: 'Anything', context: { value: 'anything' } },
        { path: ['month'], message: 'Anything', context: { value: 'anything' } }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must be a real date')
    })

    test('it should return "Date of birth must include a day and month" when day and month are empty', () => {
      const errors = [
        { path: ['day'], message: 'Anything', context: { value: '' } },
        { path: ['month'], message: 'Anything', context: { value: '' } }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must include a day and month')
    })

    test('it should return "Date of birth must be a real date" when month and year are invalid', () => {
      const errors = [
        { path: ['year'], message: 'Anything', context: { value: 'anything' } },
        { path: ['month'], message: 'Anything', context: { value: 'anything' } }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must be a real date')
    })

    test('it should return "Date of birth must include a month and year" when month and year are empty', () => {
      const errors = [
        { path: ['year'], message: 'Anything', context: { value: '' } },
        { path: ['month'], message: 'Anything', context: { value: '' } }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must include a month and year')
    })

    test('it should return "Date of birth must be a real date" when day and year are invalid', () => {
      const errors = [
        { path: ['year'], message: 'Anything', context: { value: 'anything' } },
        { path: ['day'], message: 'Anything', context: { value: 'anything' } }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must be a real date')
    })

    test('it should return "Date of birth must include a day and year" when day and year are empty', () => {
      const errors = [
        { path: ['year'], message: 'Anything', context: { value: '' } },
        { path: ['day'], message: 'Anything', context: { value: '' } }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must include a day and year')
    })

    test('it should return "Date of birth must be a real date" when only day is invalid', () => {
      const errors = [{ path: ['day'], message: 'Anything', context: { value: 'anything' } }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must be a real date')
    })

    test('it should return "Date of birth must be a real date" when only month is invalid', () => {
      const errors = [{ path: ['month'], message: 'Anything', context: { value: 'anything' } }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must be a real date')
    })

    test('it should return "Date of birth must be a real date" when only year is invalid', () => {
      const errors = [{ path: ['year'], message: 'Anything', context: { value: 'anything' } }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must be a real date')
    })

    test('it should return "Date of birth must include a day" when only day is empty', () => {
      const errors = [{ path: ['day'], message: 'Anything', context: { value: '' } }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must include a day')
    })

    test('it should return "Date of birth must include a month" when only month is empty', () => {
      const errors = [{ path: ['month'], message: 'Anything', context: { value: '' } }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must include a month')
    })

    test('it should return "Date of birth must include a year" when only year is empty', () => {
      const errors = [{ path: ['year'], message: 'Anything', context: { value: '' } }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Date of birth must include a year')
    })

    test('it should return "Enter a year with 4 numbers, like 1975" when year is only 2 digits', () => {
      const errors = [{ path: ['year'], message: 'year must be 4 digits and greater than 1000', context: { value: '89' } }]
      const result = formatDateValidationErrors(errors)
      expect(result.dateError).toEqual('Enter a year with 4 numbers, like 1975')
    })
  })
})
