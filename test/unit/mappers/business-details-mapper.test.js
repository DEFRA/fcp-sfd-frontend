// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Test helpers
import { getDalData, getMappedData } from '../../mocks/mock-business-details.js'

// Thing under test
const { mapBusinessDetails } = await import('../../../src/mappers/business-details-mapper.js')

describe('businessDetailsMapper', () => {
  let dalData

  beforeEach(() => {
    dalData = getDalData()
  })

  describe('when given valid raw DAL data', () => {
    describe('full mapping', () => {
      test('it should map the values to the correct format', () => {
        const result = mapBusinessDetails(dalData)

        expect(result).toEqual(getMappedData())
      })
    })

    describe('customer.userName', () => {
      test('it should build the userName correctly', () => {
        const result = mapBusinessDetails(
          dalWithName(dalData, { first: 'Software', last: 'Developer' })
        )

        expect(result.customer.userName).toEqual('Software Developer')
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
