// Test framework dependencies
import { describe, test, expect } from 'vitest'

// Thing under test
import { dynamicBacklink } from '../../../src/utils/dynamic-backlink.js'

describe('dynamicBackLink', () => {
  test('returns / if referer is undefined', () => {
    expect(dynamicBacklink(undefined)).toBe('/')
    expect(dynamicBacklink(null)).toBe('/')
  })

  test('returns only pathname if referer is a full URL', () => {
    expect(dynamicBacklink('https://example.com/business-address-check')).toBe('/business-address-check')
    expect(dynamicBacklink('http://localhost:3000/test/path')).toBe('/test/path')
  })

  test('returns the path as-is if referer is already a path starting with /', () => {
    expect(dynamicBacklink('/my-page')).toBe('/my-page')
    expect(dynamicBacklink('/another/path')).toBe('/another/path')
  })

  test('prepends / if referer is a relative path not starting with /', () => {
    expect(dynamicBacklink('some-page')).toBe('/some-page')
    expect(dynamicBacklink('another/path')).toBe('/another/path')
  })

  test('returns / if referer is an invalid URL string', () => {
    // Invalid full URL
    expect(dynamicBacklink('http://')).toBe('/http://')
    // Non-URL string without leading /
    expect(dynamicBacklink('invalid-url')).toBe('/invalid-url')
  })
})
