// Test framework dependencies
import { describe, test, expect } from 'vitest'

// Thing under test
import { fetchBusinessNameService } from '../../../../src/services/business/fetch-business-name-service.js'

describe('fetchBusinessNameService', () => {
  describe('when called', () => {
    test('it correctly returns the data', async () => {
      const result = await fetchBusinessNameService()

      expect(result).toEqual({
        businessName: 'Agile Farm Ltd',
        sbi: '123456789',
        userName: 'Alfred Waldron'
      })
    })
  })
})
