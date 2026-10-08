// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { checkWoodlandManagementAllowList } from '../../../../src/services/grants/check-woodland-management-allow-list-service.js'

// Mock dependencies
import { config } from '../../../../src/config/index.js'
import { allowListService } from '../../../../src/services/allow-list-service.js'
import { getAllowedGrants } from '../../../../src/services/grants/get-allowed-grants-service.js'

// Mock imports
vi.mock('../../../../src/config/index.js', () => ({
  config: {
    get: vi.fn()
  }
}))

vi.mock('../../../../src/services/allow-list-service.js', () => ({
  allowListService: vi.fn()
}))

vi.mock('../../../../src/services/grants/get-allowed-grants-service.js', () => ({
  getAllowedGrants: vi.fn()
}))

describe('checkWoodlandManagementAllowListService', () => {
  const sbi = 123456789
  const crn = 987654321

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when the Grants API allow list is disabled', () => {
    beforeEach(() => {
      config.get.mockReturnValue(false)
      allowListService.mockReturnValue(true)
    })

    test('it falls back to the environment variable allow lists', async () => {
      const result = await checkWoodlandManagementAllowList(sbi, crn)

      expect(allowListService).toHaveBeenCalledWith(sbi, crn, 'woodlandManagement')
      expect(getAllowedGrants).not.toHaveBeenCalled()
      expect(result).toBe(true)
    })
  })

  describe('when the Grants API allow list is enabled', () => {
    beforeEach(() => {
      config.get.mockReturnValue(true)
    })

    test('it returns true when the Grants API returns the woodland grant', async () => {
      getAllowedGrants.mockResolvedValue(['woodland'])

      const result = await checkWoodlandManagementAllowList(sbi, crn)

      expect(getAllowedGrants).toHaveBeenCalledWith(sbi, crn)
      expect(allowListService).not.toHaveBeenCalled()
      expect(result).toBe(true)
    })

    test('it returns false when the Grants API returns other grants only', async () => {
      getAllowedGrants.mockResolvedValue(['grasslands'])

      const result = await checkWoodlandManagementAllowList(sbi, crn)

      expect(result).toBe(false)
    })

    test('it returns false when the Grants API returns no grants', async () => {
      getAllowedGrants.mockResolvedValue([])

      const result = await checkWoodlandManagementAllowList(sbi, crn)

      expect(result).toBe(false)
    })
  })
})
