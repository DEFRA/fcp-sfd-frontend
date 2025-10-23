// Test framework dependencies
import { describe, test, expect } from 'vitest'

// Thing under test
import { mockPostcode } from '../../../../src/services/os-places/os-places-stub.js'

// Test helpers
import { mockAddresses } from '../../../../src/mock-data/mock-os-places-addresses.js'

describe('mockPostcode', () => {
  test('returns matching addresses for a valid postcode (ignoring case and spaces)', () => {
    const result = mockPostcode('sw1a 1aa')

    // All mockAddresses with SW1A 1AA should be matched
    const expectedMatches = mockAddresses.filter(addr =>
      addr.properties.POSTCODE === 'SW1A 1AA'
    )

    expect(result.features).toHaveLength(expectedMatches.length)
    expect(result.features).toEqual(expectedMatches)
  })

  test('handles postcodes with inconsistent casing and spacing', () => {
    const result = mockPostcode('  Sw1A     1Aa ')

    const expectedMatches = mockAddresses.filter(addr =>
      addr.properties.POSTCODE === 'SW1A 1AA'
    )

    expect(result.features).toHaveLength(expectedMatches.length)
    expect(result.features).toEqual(expectedMatches)
  })

  test('returns empty array when postcode does not exist', () => {
    const result = mockPostcode('ZZ9 9ZZ')

    expect(result.features).toEqual([])
  })

  test('returns empty array for undefined input', () => {
    const result = mockPostcode(undefined)

    expect(result.features).toEqual([])
  })

  test('returns empty array for empty string input', () => {
    const result = mockPostcode('')

    expect(result.features).toEqual([])
  })

  test('returns only BS14 8XX addresses when given that postcode', () => {
    const result = mockPostcode('BS14 8XX')

    const expectedMatches = mockAddresses.filter(addr =>
      addr.properties.POSTCODE === 'BS14 8XX'
    )

    expect(result.features).toHaveLength(expectedMatches.length)
    expect(result.features).toEqual(expectedMatches)
  })
})
