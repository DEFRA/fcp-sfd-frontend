import { vi, beforeAll, describe, test, expect, afterAll } from 'vitest'
import { formatDate } from '../../../../../src/plugins/template-renderer/filters/format-date.js'

describe('#formatDate', () => {
  beforeAll(() => {
    vi.useFakeTimers({
      now: new Date('2023-02-01')
    })
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  describe('With defaults', () => {
    test('Date should be in expected format', () => {
      expect(formatDate('2023-02-01T11:40:02.242Z')).toBe(
        'Wed 1st February 2023'
      )
    })
  })

  describe('With Date object', () => {
    test('Date should be in expected format', () => {
      expect(formatDate(new Date())).toBe('Wed 1st February 2023')
    })
  })

  describe('With format attribute', () => {
    test('Date should be in provided format', () => {
      expect(
        formatDate(
          '2023-02-01T11:40:02.242Z',
          "h:mm aaa 'on' EEEE do MMMM yyyy"
        )
      ).toBe('11:40 am on Wednesday 1st February 2023')
    })
  })

  describe('ordinal suffixes', () => {
    test('should use "nd" suffix for 2nd', () => {
      expect(formatDate('2023-02-02')).toBe('Thu 2nd February 2023')
    })

    test('should use "rd" suffix for 3rd', () => {
      expect(formatDate('2023-02-03')).toBe('Fri 3rd February 2023')
    })

    test('should use "th" suffix for 4th', () => {
      expect(formatDate('2023-02-04')).toBe('Sat 4th February 2023')
    })

    test('should use "th" suffix for 11th', () => {
      expect(formatDate('2023-02-11')).toBe('Sat 11th February 2023')
    })

    test('should use "th" suffix for 12th', () => {
      expect(formatDate('2023-02-12')).toBe('Sun 12th February 2023')
    })

    test('should use "th" suffix for 13th', () => {
      expect(formatDate('2023-02-13')).toBe('Mon 13th February 2023')
    })
  })

  describe('With invalid date', () => {
    test('should return empty string for invalid date string', () => {
      expect(formatDate('not-a-date')).toBe('')
    })
  })
})
