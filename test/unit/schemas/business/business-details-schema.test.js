// Test framework dependencies
import { describe, test, expect } from 'vitest'

// Thing under test
import { businessDetailsSchema } from '../../../../src/schemas/business/business-details-schema.js'

describe('business details schema', () => {
  test('exposes all business detail schemas', () => {
    expect(businessDetailsSchema).toHaveProperty('name')
    expect(businessDetailsSchema).toHaveProperty('address')
    expect(businessDetailsSchema).toHaveProperty('phone')
    expect(businessDetailsSchema).toHaveProperty('email')
    expect(businessDetailsSchema).toHaveProperty('vat')
  })
})
