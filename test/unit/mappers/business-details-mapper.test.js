import { describe, test, expect, vi } from 'vitest'
// import { mapBusinessDetails } from '../../../src/mappers/business-details-mapper.js'
import { dalData, mappedData } from '../../mocks/mock-business-details.js'

vi.mock('../../../src/utils/logger.js', () => ({
  createLogger: vi.fn().mockReturnValue({
    error: vi.fn()
  })
}))

const { createLogger } = await import('../../../src/utils/logger.js')
const { mapBusinessDetails } = await import('../../../src/mappers/business-details-mapper.js')

const mockLogger = createLogger()

describe('businessDetailsMapper', () => {
  describe('when given valid raw DAL data ', () => {
    test('it should map the values to the correct format ', () => {
      const result = mapBusinessDetails(dalData)
      expect(result).toEqual(mappedData)
    })

    test('it should build the fullname correctly ', () => {
      const fullNameCheckData = {
        ...dalData,
        customer: {
          info: {
            name: {
              first: 'Software',
              last: 'Developer',
              title: 'Mr.'
            }
          }
        }
      }
      const result = mapBusinessDetails(fullNameCheckData)
      expect(result.customer.fullName).toEqual('Mr. Software Developer')
    })
  })

  describe('when given invalid raw DAL data ', () => {
    test('it should log a warning about invalid data ', () => {
      const invalidData = {}
      const wrapper = () => mapBusinessDetails(invalidData)
      expect(wrapper).toThrow()
      expect(mockLogger.error).toHaveBeenCalledWith('Validation fail for DAL response: "business" is required')
    })
  })
})
