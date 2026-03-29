// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { businessDetailsQuery, businessDetailsQueryWithoutCph } from '../../../../src/dal/queries/business-details.js'

// Mock dependencies
const mockMapBusinessDetails = vi.fn()
const mockConfigValues = {}
const mockDalConnector = vi.fn()

// Mock imports
vi.mock('../../../../src/dal/connector.js', () => ({
  getDalConnector: vi.fn(() => mockDalConnector)
}))

vi.mock('../../../../src/mappers/business-details-mapper.js', () => ({
  mapBusinessDetails: mockMapBusinessDetails
}))

vi.mock('../../../../src/config/index.js', () => ({
  config: {
    get: (key) => mockConfigValues[key]
  }
}))

// Test helpers
const { mappedData, mappedDataWithoutCph, dalData } = await import('../../../../src/mock-data/mock-business-details.js')

// Thing under test
const { fetchBusinessDetailsService } = await import('../../../../src/services/business/fetch-business-details-service.js')

describe('fetchBusinessDetailsService', () => {
  let credentials

  beforeEach(async () => {
    vi.clearAllMocks()

    // Reset config values
    Object.keys(mockConfigValues).forEach(key => {
      delete mockConfigValues[key]
    })

    credentials = {
      sbi: '132432422',
      crn: '64363553663',
      email: 'test.farmer@test.farm.com',
      sessionId: 'test-session-id'
    }
  })

  describe('when DAL_CONNECTION is true and CPH_ENABLED is true', () => {
    beforeEach(() => {
      Object.assign(mockConfigValues, {
        'featureToggle.dalConnection': true,
        'featureToggle.cphEnabled': true
      })
      mockDalConnector.mockResolvedValue({ data: dalData })
      mockMapBusinessDetails.mockReturnValue(mappedData)
    })

    test('should call dalConnector with businessDetailsQuery', async () => {
      await fetchBusinessDetailsService(credentials)

      expect(mockDalConnector).toHaveBeenCalledWith(
        businessDetailsQuery,
        { sbi: credentials.sbi, crn: credentials.crn },
        credentials.sessionId
      )
    })

    test('should map and return the DAL response when it contains data', async () => {
      const result = await fetchBusinessDetailsService(credentials)

      expect(mockDalConnector).toHaveBeenCalled()
      expect(mockMapBusinessDetails).toHaveBeenCalledWith(dalData)
      expect(result).toEqual(mappedData)
    })

    test('should return the raw DAL response when it has no data property', async () => {
      const errorResponse = { error: 'error response from dal' }
      mockDalConnector.mockResolvedValue(errorResponse)

      const result = await fetchBusinessDetailsService(credentials)

      expect(mockMapBusinessDetails).not.toHaveBeenCalled()
      expect(result).toEqual(errorResponse)
    })
  })

  describe('when DAL_CONNECTION is true and CPH_ENABLED is false', () => {
    beforeEach(() => {
      Object.assign(mockConfigValues, {
        'featureToggle.dalConnection': true,
        'featureToggle.cphEnabled': false
      })
      mockDalConnector.mockResolvedValue({ data: dalData })
      mockMapBusinessDetails.mockReturnValue(mappedData)
    })

    test('should call dalConnector with businessDetailsQueryWithoutCph', async () => {
      await fetchBusinessDetailsService(credentials)

      expect(mockDalConnector).toHaveBeenCalledWith(
        businessDetailsQueryWithoutCph,
        { sbi: credentials.sbi, crn: credentials.crn },
        credentials.sessionId
      )
    })

    test('should map and return the DAL response when it contains data', async () => {
      const result = await fetchBusinessDetailsService(credentials)

      expect(mockDalConnector).toHaveBeenCalled()
      expect(mockMapBusinessDetails).toHaveBeenCalledWith(dalData)
      expect(result).toEqual(mappedData)
    })

    test('should return the raw DAL response when it has no data property', async () => {
      const errorResponse = { error: 'error response from dal' }
      mockDalConnector.mockResolvedValue(errorResponse)

      const result = await fetchBusinessDetailsService(credentials)

      expect(mockMapBusinessDetails).not.toHaveBeenCalled()
      expect(result).toEqual(errorResponse)
    })
  })

  describe('when DAL_CONNECTION is false and CPH_ENABLED is true', () => {
    beforeEach(() => {
      Object.assign(mockConfigValues, {
        'featureToggle.dalConnection': false,
        'featureToggle.cphEnabled': true
      })
    })

    test('should not call dalConnector', async () => {
      await fetchBusinessDetailsService(credentials)

      expect(mockDalConnector).not.toHaveBeenCalled()
    })

    test('should correctly return mappedData', async () => {
      const result = await fetchBusinessDetailsService(credentials)

      expect(result).toEqual(mappedData)
    })
  })

  describe('when DAL_CONNECTION is false and CPH_ENABLED is false', () => {
    beforeEach(() => {
      Object.assign(mockConfigValues, {
        'featureToggle.dalConnection': false,
        'featureToggle.cphEnabled': false
      })
    })

    test('should not call dalConnector', async () => {
      await fetchBusinessDetailsService(credentials)

      expect(mockDalConnector).not.toHaveBeenCalled()
    })

    test('should correctly return mappedDataWithoutCph', async () => {
      const result = await fetchBusinessDetailsService(credentials)

      expect(result).toEqual(mappedDataWithoutCph)
    })
  })
})
