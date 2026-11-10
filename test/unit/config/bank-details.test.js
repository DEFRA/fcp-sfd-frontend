// Test framework dependencies
import { describe, test, expect } from 'vitest'

// Thing under test
import { bankDetailsConfig } from '../../../src/config/bank-details.js'

const { format } = bankDetailsConfig.bankDetails.webIdentityToken.durationSeconds

describe('bank details config', () => {
  describe('webIdentityToken.durationSeconds', () => {
    test.each([120, 300, 900])('should accept %s', (value) => {
      expect(() => format(value)).not.toThrow()
    })

    // At or below the 60s refresh margin the cache is never used; above 900 AWS rejects the call
    test.each([60, 119, 901, 3600, 300.5, '300', null])('should reject %s', (value) => {
      expect(() => format(value)).toThrow('must be an integer between 120 and 900')
    })
  })
})
