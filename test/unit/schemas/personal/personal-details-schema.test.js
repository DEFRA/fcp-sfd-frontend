// Test framework dependencies
import { describe, test, expect } from 'vitest'

// Thing under test
import { personalDetailsSchema } from '../../../../src/schemas/personal/personal-details-schema.js'

describe('personal details schema', () => {
  test('exposes all personal detail schemas', () => {
    expect(personalDetailsSchema).toHaveProperty('name')
    expect(personalDetailsSchema).toHaveProperty('dob')
    expect(personalDetailsSchema).toHaveProperty('address')
    expect(personalDetailsSchema).toHaveProperty('phone')
    expect(personalDetailsSchema).toHaveProperty('email')
  })
})
