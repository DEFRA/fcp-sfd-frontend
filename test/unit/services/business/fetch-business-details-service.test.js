// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { dalConnector } from '../../../../src/dal/connector.js'
import { businessDetailsQuery, businessDetailsQueryWithoutCph } from '../../../../src/dal/queries/business-details.js'

// Mock dependencies
const mockMappedValue = vi.fn()
const mockConfigValues = {}

// Mock imports
vi.mock('../../../../src/dal/connector.js', () => ({
  dalConnector: vi.fn()
}))

vi.mock('../../../../src/mappers/business-details-mapper.js', () => ({
  mapBusinessDetails: mockMappedValue
}))

vi.mock('../../../../src/config/index.js', () => ({
  config: {
    get: (key) => mockConfigValues[key]
  }
}))

// Test helpers
const { mappedData, dalData } = await import('../../../mocks/mock-business-details.js')

// Thing under test
const { fetchBusinessDetailsService } = await import('../../../../src/services/business/fetch-business-details-service.js')

describe('fetchBusinessDetailsService', () => {
  let data
  let credentials
  let mappedDalData

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()

    // Reset config values
    Object.keys(mockConfigValues).forEach(key => {
      delete mockConfigValues[key]
    })

    data = { data: dalData }
    mappedDalData = mappedData

    credentials = {
      sbi: '132432422',
      crn: '64363553663',
      email: 'test.farmer@test.farm.com'
    }
  })

  describe('when DAL_CONNECTION is true', () => {
    beforeEach(() => {
      Object.assign(mockConfigValues, {
        'featureToggle.dalConnection': true,
        'featureToggle.cphEnabled': true
      })
      dalConnector.mockResolvedValue(data)
      mockMappedValue.mockReturnValue(mappedDalData)
    })

    test('dalConnector is called', async () => {
      await fetchBusinessDetailsService(credentials)

      expect(dalConnector).toHaveBeenCalled()
    })

    test('it uses businessDetailsQuery when CPH_ENABLED is true', async () => {
      await fetchBusinessDetailsService(credentials)

      expect(dalConnector).toHaveBeenCalledWith(
        businessDetailsQuery,
        expect.any(Object)
      )
    })

    test('it uses businessDetailsQueryWithoutCph when CPH_ENABLED is false', async () => {
      mockConfigValues['featureToggle.cphEnabled'] = false

      await fetchBusinessDetailsService(credentials)

      expect(dalConnector).toHaveBeenCalledWith(
        businessDetailsQueryWithoutCph,
        expect.any(Object)
      )
    })

    test('it strips CPH numbers when CPH_ENABLED is false', async () => {
      mockConfigValues['featureToggle.cphEnabled'] = false
      // Mock DAL data without CPH (simulating businessDetailsQueryWithoutCph response)
      const dalDataWithoutCph = {
        ...dalData,
        business: {
          ...dalData.business,
          countyParishHoldings: undefined
        }
      }
      dalConnector.mockResolvedValue({ data: dalDataWithoutCph })
      // Mock mapper to return data without CPH (mapper will default to empty array)
      const mappedDataWithoutCph = {
        ...mappedDalData,
        info: {
          ...mappedDalData.info,
          countyParishHoldingNumbers: []
        }
      }
      mockMappedValue.mockReturnValue(mappedDataWithoutCph)

      const result = await fetchBusinessDetailsService(credentials)

      expect(result.info.countyParishHoldingNumbers).toEqual([])
    })

    test('it correctly returns mappedData if dalConnector response has object data', async () => {
      const result = await fetchBusinessDetailsService(credentials)

      expect(result).toMatchObject(mappedDalData)
    })

    test('it returns the full response object if dalConnector response has no object data', async () => {
      dalConnector.mockResolvedValue({ error: 'error response from dal' })
      const result = await fetchBusinessDetailsService(credentials)

      expect(result).toEqual({ error: 'error response from dal' })
    })
  })

  describe('when DAL_CONNECTION is false', () => {
    beforeEach(() => {
      Object.assign(mockConfigValues, {
        'featureToggle.dalConnection': false,
        'featureToggle.cphEnabled': true
      })
    })

    test('dalConnector is not called', async () => {
      await fetchBusinessDetailsService(credentials)

      expect(dalConnector).not.toHaveBeenCalled()
    })

    test('it correctly returns data static data source', async () => {
      const result = await fetchBusinessDetailsService(credentials)

      expect(result).toMatchObject(mappedData)
    })

    test('it strips CPH numbers when CPH_ENABLED is false', async () => {
      mockConfigValues['featureToggle.cphEnabled'] = false

      const result = await fetchBusinessDetailsService(credentials)

      expect(result.info.countyParishHoldingNumbers).toEqual([])
    })
  })
})
