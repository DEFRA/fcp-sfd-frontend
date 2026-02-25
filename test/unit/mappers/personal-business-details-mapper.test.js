// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Test helpers
import { getDalData, getMappedData } from '../../mocks/mock-personal-business-details.js'

// Thing under test
const { mapPersonalBusinessDetails } = await import('../../../src/mappers/personal-business-details-mapper.js')

describe('personalBusinessDetailsMapper', () => {
  let dalData

  beforeEach(() => {
    dalData = getDalData()
  })

  describe('when given valid raw DAL data', () => {
    describe('full mapping', () => {
      test('it should map the values to the correct format', () => {
        const result = mapPersonalBusinessDetails(dalData)

        expect(result).toEqual(getMappedData())
      })
    })

    describe('info.userName', () => {
      test('it should build the userName correctly', () => {
        const result = mapPersonalBusinessDetails(
          dalWithName(dalData, { first: 'Software', last: 'Developer', middle: null })
        )

        expect(result.info.userName).toEqual('Software Developer')
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
