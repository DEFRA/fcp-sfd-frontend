import { describe, test, expect } from 'vitest'
import { getBusinessLegalStatusChange } from '../../../../src/routes/business-details/business-legal-status-change.js'

describe('Change business legal status', () => {
  test('should have the correct method and path', () => {
    expect(getBusinessLegalStatusChange.method).toBe('GET')
    expect(getBusinessLegalStatusChange.path).toBe('/business-legal-status-change')
  })
})
