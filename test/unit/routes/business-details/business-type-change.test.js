import { describe, test, expect } from '@jest/globals'
import { getBusinessTypeChange } from '../../../../src/routes/business-details/business-type-change.js'

describe('Change business type', () => {
  test('should have the correct method and path', () => {
    expect(getBusinessTypeChange.method).toBe('GET')
    expect(getBusinessTypeChange.path).toBe('/business-type-change')
  })
})
