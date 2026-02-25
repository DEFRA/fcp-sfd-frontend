import { describe, test, expect, vi } from 'vitest'
import { getDalData, getMappedData } from '../../mocks/mock-permissions.js'

vi.mock('../../../src/utils/logger.js', () => ({
  createLogger: vi.fn().mockReturnValue({
    error: vi.fn()
  })
}))

const { createLogger } = await import('../../../src/utils/logger.js')
const { mapPermissions } = await import('../../../src/mappers/permissions-mapper.js')

const mockLogger = createLogger()

describe('permissionMapper', () => {
  describe('when given valid raw DAL data ', () => {
    test('it should map the values to the correct format ', () => {
      const result = mapPermissions(getDalData())
      expect(result).toEqual(getMappedData())
    })

    test('it should build the privileges correctly ', () => {
      const result = mapPermissions(getDalData())

      expect(result.privileges).toEqual(getMappedData().privileges)
    })

    test('it should build the businessName correctly ', () => {
      const result = mapPermissions(getDalData())

      expect(result.businessName).toEqual(getMappedData().businessName)
    })
  })

  describe('when given invalid raw DAL data ', () => {
    test('it should log a warning about invalid data ', () => {
      const invalidData = {}

      const wrapper = () => mapPermissions(invalidData)

      expect(wrapper).toThrow()
      expect(mockLogger.error).toHaveBeenCalledWith('Permission Validation fail for DAL response: "business" is required')
    })
  })
})
