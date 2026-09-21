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

    describe('business.name', () => {
      test('it should map the business name for the back link', () => {
        const result = mapPersonalDetails(dalData)

        expect(result.business.name).toEqual('Acme Farms Ltd')
      })

      test('it should default to null when business is missing', () => {
        delete dalData.business

        const result = mapPersonalDetails(dalData)

        expect(result.business.name).toBeNull()
      })
    })
  })
})
