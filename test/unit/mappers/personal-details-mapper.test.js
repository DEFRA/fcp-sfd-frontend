import { describe, test, expect, vi } from 'vitest'
import { dalData, mappedData } from '../../mocks/mock-personal-details.js'

vi.mock('../../../src/utils/logger.js', () => ({
  createLogger: vi.fn().mockReturnValue({
    error: vi.fn()
  })
}))

const { createLogger } = await import('../../../src/utils/logger.js')
const { mapPersonalDetails } = await import('../../../src/mappers/personal-details-mapper.js')

const mockLogger = createLogger()

describe('personalDetailsMapper', () => {
  describe('when given valid raw DAL data ', () => {
    test('it should map the values to the correct format ', () => {
      const result = mapPersonalDetails(dalData)

      expect(result).toEqual(mappedData)
    })
  })

  describe('when given invalid raw DAL data ', () => {
    test('it should log a warning about invalid data ', () => {
      // By deleting the crn number this should make the data fail validation
      delete dalData.customer.crn

      const wrapper = () => mapPersonalDetails(dalData)

      expect(wrapper).toThrow()
      expect(mockLogger.error).toHaveBeenCalledWith('Validation fail for personal-details DAL response: "customer.crn" is required')
    })
  })
})
