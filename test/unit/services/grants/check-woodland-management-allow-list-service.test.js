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
      expect(result).toEqual({ isAllowed: true, url: null })
    })
  })

  describe('when the Grants API allow list is enabled', () => {
    beforeEach(() => {
      config.get.mockReturnValue(true)
    })

    test('it returns the grant URL when the Grants API returns the woodland grant', async () => {
      getAllowedGrants.mockResolvedValue([
        { code: 'woodland', url: 'https://grants-ui.test.cdp-int.defra.cloud/woodland' }
      ])

      const result = await checkWoodlandManagementAllowList(sbi, crn)

      expect(getAllowedGrants).toHaveBeenCalledWith(sbi, crn)
      expect(allowListService).not.toHaveBeenCalled()
      expect(result).toEqual({
        isAllowed: true,
        url: 'https://grants-ui.test.cdp-int.defra.cloud/woodland'
      })
    })

    test('it returns a null URL when the Grants API omits one', async () => {
      getAllowedGrants.mockResolvedValue([{ code: 'woodland' }])

      const result = await checkWoodlandManagementAllowList(sbi, crn)

      expect(result).toEqual({ isAllowed: true, url: null })
    })

    test('it is not allowed when the Grants API returns other grants only', async () => {
      getAllowedGrants.mockResolvedValue([{ code: 'grasslands', url: 'https://grants.test/grasslands' }])

      const result = await checkWoodlandManagementAllowList(sbi, crn)

      expect(result).toEqual({ isAllowed: false, url: null })
    })

    test('it is not allowed when the Grants API returns no grants', async () => {
      getAllowedGrants.mockResolvedValue([])

      const result = await checkWoodlandManagementAllowList(sbi, crn)

      expect(result).toEqual({ isAllowed: false, url: null })
    })
  })
})
