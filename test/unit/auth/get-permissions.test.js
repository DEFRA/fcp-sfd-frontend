import { vi, beforeEach, describe, test, expect } from 'vitest'
import { getDalData, getMappedData } from '../../mocks/mock-permissions.js'
import { mapPermissions } from '../../../src/mappers/permissions-mapper.js'
import { permissionsQuery } from '../../../src/dal/queries/permissions-query.js'

const mockDalConnector = vi.fn()

vi.mock('../../../src/dal/connector.js', () => ({
  getDalConnector: vi.fn(() => mockDalConnector)
}))

vi.mock('../../../src/mappers/permissions-mapper.js', () => ({
  mapPermissions: vi.fn()
}))

vi.mock('../../../src/dal/queries/permissions-query.js', () => ({
  permissionsQuery: vi.fn()
}))

const { getPermissions } = await import('../../../src/auth/get-permissions.js')
let sbi
let crn

describe('getPermissions', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    sbi = '234654278765'
    crn = '987645433252'

    mapPermissions.mockReturnValue(getMappedData())
    mockDalConnector.mockResolvedValue({ data: getDalData() })
  })

  describe('when fetching from the DAL', () => {
    test('should call dalConnector with getPermission parameters', async () => {
      await getPermissions(sbi, crn)
      expect(mockDalConnector).toHaveBeenCalledWith(permissionsQuery, { sbi, crn }, null, undefined)
    })
    test('should call mapPermissions when dalConnector response has data', async () => {
      await getPermissions(sbi, crn)
      expect(mapPermissions).toHaveBeenCalledWith(getDalData())
    })

    test('should return mapped data when dalConnector response has data', async () => {
      const result = await getPermissions(sbi, crn)
      expect(result).toEqual(getMappedData())
    })

    test('should not call mapPermissions when dalConnector response has no data', async () => {
      mockDalConnector.mockResolvedValue({})
      await getPermissions(sbi, crn)
      expect(mapPermissions).not.toHaveBeenCalled()
    })

    test('should return dalConnector response when dalConnector response has no data', async () => {
      const dalResponse = { response: 'no-dal-data' }
      mockDalConnector.mockResolvedValue(dalResponse)
      const result = await getPermissions(sbi, crn)
      expect(result).toBe(dalResponse)
    })
  })
})
