// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Test helpers
import { getDalData, getMappedData } from '../../mocks/mock-personal-details.js'

// Thing under test
const { mapPersonalDetails } = await import('../../../src/mappers/personal-details-mapper.js')

describe('personalDetailsMapper', () => {
  let dalData

  beforeEach(() => {
    dalData = getDalData()
  })

  describe('when given valid raw DAL data', () => {
    describe('full mapping', () => {
      test('it should map the values to the correct format', () => {
        const result = mapPersonalDetails(dalData)

        expect(result).toEqual(getMappedData())
      })
    })

    describe('info.userName', () => {
      test('it should build the userName correctly', () => {
        const result = mapPersonalDetails(
          dalWithName(dalData, { first: 'Software', last: 'Developer', middle: null })
        )

        expect(result.info.userName).toEqual('Software Developer')
      })
    })

    describe('info.fullName', () => {
      test('it should build the fullName object correctly', () => {
        const result = mapPersonalDetails(
          dalWithName(dalData, { first: 'Software', last: 'Developer', middle: 'Engineer' })
        )

        expect(result.info.fullName).toEqual({
          first: 'Software',
          last: 'Developer',
          middle: 'Engineer'
        })
      })
    })

    describe('info.fullNameJoined', () => {
      test('it should build the fullNameJoined string correctly', () => {
        const result = mapPersonalDetails(
          dalWithName(dalData, { first: 'Software', last: 'Developer', middle: 'Engineer' })
        )

        expect(result.info.fullNameJoined).toEqual('Software Engineer Developer')
      })
    })

    describe('info.dateOfBirth', () => {
      test('it should build the date of birth correctly when it exists', () => {
        const result = mapPersonalDetails(dalWithDateOfBirth(dalData, '1990-01-01'))

        expect(result.info.dateOfBirth).toEqual({
          full: '1990-01-01',
          day: '01',
          month: '01',
          year: '1990'
        })
      })

      test('it should build the date of birth correctly when it does not exist', () => {
        const result = mapPersonalDetails(dalWithDateOfBirth(dalData, null))

        expect(result.info.dateOfBirth).toEqual({
          full: null,
          day: null,
          month: null,
          year: null
        })
      })
    })
  })
})

const dalWithName = (base, name) => {
  return {
    ...base,
    customer: {
      ...base.customer,
      info: {
        ...base.customer.info,
        name: {
          first: name.first,
          last: name.last,
          middle: name.middle ?? null
        }
      }
    }
  }
}

const dalWithDateOfBirth = (base, value) => {
  return {
    ...base,
    customer: {
      ...base.customer,
      info: {
        ...base.customer.info,
        dateOfBirth: value
      }
    }
  }
}
