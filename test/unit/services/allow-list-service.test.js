// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { allowListService } from '../../../src/services/allow-list-service.js'

// Mock dependencies
import { config } from '../../../src/config/index.js'

// Mock imports
vi.mock('../../../src/config/index.js', () => ({
  config: {
    get: vi.fn()
  }
}))

describe('allowListService', () => {
  const sbi = 123456789
  const crn = 987654321

  beforeEach(() => {
    vi.clearAllMocks()
    config.get.mockReset()
  })

  describe('when passed a CRN and SBI both in the allow list', () => {
    beforeEach(() => {
      // First time config.get is called, it returns the CRN allow list
      config.get.mockReturnValueOnce('987654321')
      // Second time config.get is called, it returns the SBI allow list
      config.get.mockReturnValueOnce('123456789')
    })

    test('it returns true', () => {
      const result = allowListService(sbi, crn, 'woodlandManagement')

      expect(result).toBe(true)
    })
  })

  describe('when passed a CRN on the allow list but an SBI that is not', () => {
    beforeEach(() => {
      config.get.mockReturnValueOnce('987654321')
      config.get.mockReturnValueOnce('111111111')
    })

    test('it returns false', () => {
      const result = allowListService(sbi, crn, 'woodlandManagement')

      expect(result).toBe(false)
    })
  })

  describe('when passed an SBI on the allow list but a CRN that is not', () => {
    beforeEach(() => {
      config.get.mockReturnValueOnce('111111111')
      config.get.mockReturnValueOnce('123456789')
    })

    test('it returns false', () => {
      const result = allowListService(sbi, crn, 'woodlandManagement')

      expect(result).toBe(false)
    })
  })

  describe('when passed a schema that does not exist in the allowListMap', () => {
    test('it returns false', () => {
      const result = allowListService(sbi, crn, 'unknownSchema')

      expect(result).toBe(false)
    })
  })

  describe('when one or both allow lists are empty', () => {
    beforeEach(() => {
      config.get.mockReturnValueOnce('')
      config.get.mockReturnValueOnce('')
    })

    test('it returns false', () => {
      const result = allowListService(sbi, crn, 'woodlandManagement')

      expect(result).toBe(false)
    })
  })

  describe('when one or both allow lists are misconfigured', () => {
    beforeEach(() => {
      config.get.mockReturnValueOnce(' , ,   ')
      config.get.mockReturnValueOnce('123456789')
    })

    test('it returns false', () => {
      const result = allowListService(sbi, crn, 'woodlandManagement')

      expect(result).toBe(false)
    })
  })
})
