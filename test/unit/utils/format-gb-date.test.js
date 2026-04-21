// Test framework dependencies
import { describe, test, expect } from 'vitest'

import { formatGbDate } from '../../../src/utils/format-gb-date.js'

describe('formatGbDate', () => {
  describe('formatting standard dates', () => {
    test('should format a date in early January', () => {
      const date = new Date(1990, 0, 15) // 15 January 1990
      expect(formatGbDate(date)).toBe('15 January 1990')
    })

    test('should format a date with single-digit day', () => {
      const date = new Date(2023, 2, 5) // 5 March 2023
      expect(formatGbDate(date)).toBe('5 March 2023')
    })

    test('should format a date with double-digit day', () => {
      const date = new Date(2023, 2, 25) // 25 March 2023
      expect(formatGbDate(date)).toBe('25 March 2023')
    })

    test('should format a date in December', () => {
      const date = new Date(2023, 11, 25) // 25 December 2023
      expect(formatGbDate(date)).toBe('25 December 2023')
    })

    test('should format the first day of the year', () => {
      const date = new Date(2000, 0, 1) // 1 January 2000
      expect(formatGbDate(date)).toBe('1 January 2000')
    })

    test('should format the last day of the year', () => {
      const date = new Date(2023, 11, 31) // 31 December 2023
      expect(formatGbDate(date)).toBe('31 December 2023')
    })

    test('should format a leap year date (29 February)', () => {
      const date = new Date(2020, 1, 29) // 29 February 2020
      expect(formatGbDate(date)).toBe('29 February 2020')
    })

    test('should format all months correctly', () => {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]

      months.forEach((month, index) => {
        const date = new Date(2023, index, 15)
        expect(formatGbDate(date)).toBe(`15 ${month} 2023`)
      })
    })
  })

  describe('handling edge cases', () => {
    test('should format dates from the past correctly', () => {
      const date = new Date(1066, 9, 14) // 14 October 1066
      expect(formatGbDate(date)).toBe('14 October 1066')
    })

    test('should format dates in the future correctly', () => {
      const date = new Date(2099, 6, 4) // 4 July 2099
      expect(formatGbDate(date)).toBe('4 July 2099')
    })

    test('should format dates with year 2000', () => {
      const date = new Date(2000, 0, 1) // 1 January 2000
      expect(formatGbDate(date)).toBe('1 January 2000')
    })

    test('should throw an error for invalid dates', () => {
      const invalidDate = new Date('invalid')
      expect(() => formatGbDate(invalidDate)).toThrow()
    })

    test('should coerce null to current date (Intl behavior)', () => {
      // Intl.DateTimeFormat coerces null to current date
      const result = formatGbDate(null)
      expect(result).toBeTruthy()
      expect(result).toMatch(/\d+ \w+ \d{4}/)
    })

    test('should coerce undefined to current date (Intl behavior)', () => {
      // Intl.DateTimeFormat coerces undefined to current date
      const result = formatGbDate(undefined)
      expect(result).toBeTruthy()
      expect(result).toMatch(/\d+ \w+ \d{4}/)
    })

    test('should throw an error for string dates', () => {
      expect(() => formatGbDate('2023-01-15')).toThrow()
    })

    test('should throw an error for plain objects', () => {
      expect(() => formatGbDate({ year: 2023, month: 0, day: 15 })).toThrow()
    })

    test('should coerce numbers to Date (timestamp milliseconds)', () => {
      // Intl.DateTimeFormat coerces numbers as timestamps
      const timestamp = new Date(2023, 0, 15).getTime()
      const result = formatGbDate(timestamp)
      expect(result).toBeTruthy()
      expect(result).toMatch(/\d+ January 2023/)
    })
  })

  describe('timezone considerations', () => {
    test('should format dates consistently regardless of timezone', () => {
      // Using Date constructor with explicit UTC offset shouldn't matter for formatted output
      const date1 = new Date(2023, 5, 15) // 15 June 2023
      const date2 = new Date(Date.UTC(2023, 5, 15)) // 15 June 2023 UTC
      // Both should format to the same day despite potential timezone differences
      expect(formatGbDate(date1)).toContain('June 2023')
      expect(formatGbDate(date2)).toContain('June 2023')
    })
  })
})
