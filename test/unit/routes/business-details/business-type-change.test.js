import { describe, test, expect } from 'vitest'
import { businessTypeRoutes } from '../../../../src/routes/business-details/business-type-change.js'
const [getBusinessTypeChange] = businessTypeRoutes

describe('change business type', () => {
  test('should have the correct method and path', () => {
    expect(getBusinessTypeChange.method).toBe('GET')
    expect(getBusinessTypeChange.path).toBe('/business-type-change')
  })
})
