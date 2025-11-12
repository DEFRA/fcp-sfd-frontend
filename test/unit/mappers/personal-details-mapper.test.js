import { describe, test, expect } from 'vitest'
import { dalData, mappedData } from '../../mocks/mock-personal-details.js'

const { mapPersonalDetails } = await import('../../../src/mappers/personal-details-mapper.js')

describe('personalDetailsMapper', () => {
  describe('when given valid raw DAL data ', () => {
    test('it should map the values to the correct format ', () => {
      const result = mapPersonalDetails(dalData)

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

      const result = mapPersonalDetails(userNameCheckData)

      expect(result.info.userName).toEqual('Software Developer')
    })

    test('it should build the fullName object correctly ', () => {
      const fullNameCheckData = {
        ...dalData,
        customer: {
          ...dalData.customer,
          info: {
            ...dalData.customer.info,
            name: {
              first: 'Software',
              last: 'Developer',
              middle: 'Engineer'
            }
          }
        }
      }

      const result = mapPersonalDetails(fullNameCheckData)

      expect(result.info.fullName).toEqual({
        first: 'Software',
        last: 'Developer',
        middle: 'Engineer'
      })
    })

    test('it should build the fullNameJoined string correctly ', () => {
      const fullNameCheckData = {
        ...dalData,
        customer: {
          ...dalData.customer,
          info: {
            ...dalData.customer.info,
            name: {
              first: 'Software',
              last: 'Developer',
              middle: 'Engineer'
            }
          }
        }
      }

      const result = mapPersonalDetails(fullNameCheckData)

      expect(result.info.fullNameJoined).toEqual('Software Engineer Developer')
    })
  })
})
