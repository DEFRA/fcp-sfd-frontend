import { describe, test, expect } from 'vitest'
import { getBusinessTypeChange } from '../../../../src/routes/business/business-type-change.routes.js'

describe('change business type', () => {
  test('should have the correct method and path', () => {
    expect(getBusinessTypeChange.method).toBe('GET')
    expect(getBusinessTypeChange.path).toBe('/business-type-change')
  })
})
