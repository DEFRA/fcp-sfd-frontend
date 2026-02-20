import { describe, test, expect } from 'vitest'
import { getDalData, getMappedData } from '../../mocks/mock-business-details.js'

const { mapBusinessDetails } = await import('../../../src/mappers/business-details-mapper.js')

describe('businessDetailsMapper', () => {
  describe('when given valid raw DAL data ', () => {
    test('it should map the values to the correct format ', () => {
      const result = mapBusinessDetails(getDalData())

      expect(result).toEqual(getMappedData())
    })

    test('it should build the userName correctly ', () => {
      const userNameCheckData = {
        ...getDalData(),
        customer: {
          info: {
            name: {
              first: 'Software',
              last: 'Developer'
            }
          }
        }
      }

      const result = mapBusinessDetails(userNameCheckData)

      expect(result.customer.userName).toEqual('Software Developer')
    })
  })
})
