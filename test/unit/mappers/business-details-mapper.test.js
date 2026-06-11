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
      beforeEach(() => {
        dalData.customer.info.name = {
          first: 'Software',
          last: 'Developer',
          middle: null
        }
      })

      test('it should build the userName correctly', () => {
        const result = mapBusinessDetails(dalData)

        expect(result.customer.userName).toEqual('Software Developer')
      })
    })
  })
})
