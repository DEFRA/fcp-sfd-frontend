import { describe, test, expect } from 'vitest'
import { businessLegalStatusRoutes } from '../../../../src/routes/business/business-legal-status-change.routes.js'
const [getBusinessLegalStatusChange] = businessLegalStatusRoutes

describe('change business legal status', () => {
  test('should have the correct method and path', () => {
    expect(getBusinessLegalStatusChange.method).toBe('GET')
    expect(getBusinessLegalStatusChange.path).toBe('/business-legal-status-change')
  })
})
