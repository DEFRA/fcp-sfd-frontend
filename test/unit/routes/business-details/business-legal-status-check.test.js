import { describe, test, expect } from '@jest/globals'
import { getBusinessTypeChange } from '../../../../src/routes/business-details/business-legal-status-change.js'

describe('Change business legal status', () => {
    test('should have the correct method and path', () => {
        expect(getBusinessTypeChange.method).toBe('GET')
        expect(getBusinessTypeChange.path).toBe('/business-legal-status-change')
    })
})