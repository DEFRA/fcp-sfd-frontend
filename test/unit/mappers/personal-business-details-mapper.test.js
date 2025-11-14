import { describe, test, expect } from 'vitest'
import { dalData, mappedData } from '../../mocks/mock-personal-business-details.js'

const { mapPersonalBusinessDetails } = await import('../../../src/mappers/personal-business-details-mapper.js')

describe('personalBusinessDetailsMapper', () => {
  describe('when given valid raw DAL data ', () => {
    test('it should map the values to the correct format ', () => {
      const result = mapPersonalBusinessDetails(dalData)

      expect(result).toEqual(mappedData)
    })

    test('it should build the userName correctly ', () => {
      const userNameCheckData = {
        ...dalData,
        customer: {
          ...dalData.customer,
          info: {
            ...dalData.customer.info,
            name: {
              first: 'Software',
              last: 'Developer',
              middle: null
            }
          }
        }
      }

      const result = mapPersonalBusinessDetails(userNameCheckData)

      expect(result.info.userName).toEqual('Software Developer')
    })
  })
})
