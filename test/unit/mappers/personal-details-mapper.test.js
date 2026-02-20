import { describe, test, expect } from 'vitest'
import { getDalData, getMappedData } from '../../mocks/mock-personal-details.js'

const { mapPersonalDetails } = await import('../../../src/mappers/personal-details-mapper.js')

describe('personalDetailsMapper', () => {
  describe('when given valid raw DAL data ', () => {
    test('it should map the values to the correct format ', () => {
      const result = mapPersonalDetails(getDalData())

      expect(result).toEqual(getMappedData())
    })

    test('it should build the userName correctly ', () => {
      const dalData = getDalData()
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
      const dalData = getDalData()
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
      const dalData = getDalData()
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

    test('it should build the date of birth correctly when it exists', () => {
      const dalData = getDalData()
      const fullNameCheckData = {
        ...dalData,
        customer: {
          ...dalData.customer,
          info: {
            ...dalData.customer.info,
            dateOfBirth: '1990-01-01'
          }
        }
      }

      const result = mapPersonalDetails(fullNameCheckData)

      expect(result.info.dateOfBirth).toEqual({
        full: '1990-01-01',
        day: '01',
        month: '01',
        year: '1990'
      })
    })

    test('it should build the date of birth correctly when it does not exist', () => {
      const dalData = getDalData()
      const fullNameCheckData = {
        ...dalData,
        customer: {
          ...dalData.customer,
          info: {
            ...dalData.customer.info,
            dateOfBirth: null
          }
        }
      }

      const result = mapPersonalDetails(fullNameCheckData)

      expect(result.info.dateOfBirth).toEqual({
        full: null,
        day: null,
        month: null,
        year: null
      })
    })
  })
})
