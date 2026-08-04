import { describe, test, expect } from 'vitest'
import { maskCrn } from '../../../src/utils/mask-crn.js'

describe('maskCrn', () => {
  test('masks all but last 4 digits of a long CRN', () => {
    expect(maskCrn(1234567890)).toBe('******7890')
  })

  test('masks a string CRN', () => {
    expect(maskCrn('1234567890')).toBe('******7890')
  })

  test('returns the value unchanged when 4 digits or fewer', () => {
    expect(maskCrn('1234')).toBe('1234')
  })

  test('returns the value unchanged when fewer than 4 digits', () => {
    expect(maskCrn('123')).toBe('123')
  })

  test('returns **** for null', () => {
    expect(maskCrn(null)).toBe('****')
  })

  test('returns **** for undefined', () => {
    expect(maskCrn(undefined)).toBe('****')
  })
})
