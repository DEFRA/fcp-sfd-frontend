import { describe, test, expect } from 'vitest'
import { maskCrn } from '../../../src/utils/mask-crn.js'

describe('#maskCrn', () => {
  test('Should return "****" for null', () => {
    expect(maskCrn(null)).toBe('****')
  })

  test('Should return "****" for undefined', () => {
    expect(maskCrn(undefined)).toBe('****')
  })

  test('Should return the value as-is when 4 chars or fewer', () => {
    expect(maskCrn('123')).toBe('123')
    expect(maskCrn('1234')).toBe('1234')
  })

  test('Should mask all but the last 4 digits for a longer string', () => {
    expect(maskCrn('1234567890')).toBe('******7890')
  })

  test('Should coerce a numeric input to string before masking', () => {
    expect(maskCrn(1234567890)).toBe('******7890')
  })
})
