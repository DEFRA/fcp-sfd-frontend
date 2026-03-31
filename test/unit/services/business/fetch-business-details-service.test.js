// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { dalConnector } from '../../../../src/dal/connector.js'
import { businessDetailsQuery, businessDetailsQueryWithoutCph } from '../../../../src/dal/queries/business-details.js'

// Test helpers
import { getMappedData, getDalData } from '../../../mocks/mock-business-details.js'

// Mock dependencies
const mockMapBusinessDetails = vi.fn()
const mockConfigValues = {}
const mockGetConfigService = vi.fn()

// Mock imports
vi.mock('../../../../src/dal/connector.js', () => ({
  dalConnector: vi.fn()
}))

vi.mock('../../../../src/mappers/business-details-mapper.js', () => ({
  mapBusinessDetails: mockMapBusinessDetails
}))

vi.mock('../../../../src/services/get-config-service.js', () => ({
  getConfigService: mockGetConfigService
}))

vi.mock('../../../../src/config/index.js', () => ({
  config: {
    get: (key) => mockConfigValues[key]
  }
}))

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

  describe('when CPH_ENABLED is true', () => {
    beforeEach(() => {
      Object.assign(mockConfigValues, {
        'featureToggle.cphEnabled': true
      })
      mockGetConfigService.mockResolvedValue(true)
      dalConnector.mockResolvedValue({ data: getDalData() })
      mockMapBusinessDetails.mockReturnValue(getMappedData())
    })

    test('should call dalConnector with businessDetailsQuery', async () => {
      await fetchBusinessDetailsService(credentials)

      expect(dalConnector).toHaveBeenCalledWith(
        businessDetailsQuery,
        { sbi: credentials.sbi, crn: credentials.crn },
        credentials.sessionId
      )
    })

    test('should map and return the DAL response when it contains data', async () => {
      const result = await fetchBusinessDetailsService(credentials)

      expect(dalConnector).toHaveBeenCalled()
      expect(mockMapBusinessDetails).toHaveBeenCalledWith(getDalData())
      expect(result).toEqual(getMappedData())
    })

    test('should return the raw DAL response when it has no data property', async () => {
      const errorResponse = { error: 'error response from dal' }
      dalConnector.mockResolvedValue(errorResponse)

      const result = await fetchBusinessDetailsService(credentials)

      expect(mockMapBusinessDetails).not.toHaveBeenCalled()
      expect(result).toEqual(errorResponse)
    })
  })

  describe('when CPH_ENABLED is false', () => {
    beforeEach(() => {
      Object.assign(mockConfigValues, {
        'featureToggle.cphEnabled': false
      })
      mockGetConfigService.mockResolvedValue(false)
      dalConnector.mockResolvedValue({ data: getDalData() })
      mockMapBusinessDetails.mockReturnValue(getMappedData())
    })

    test('should call dalConnector with businessDetailsQueryWithoutCph', async () => {
      await fetchBusinessDetailsService(credentials)

      expect(dalConnector).toHaveBeenCalledWith(
        businessDetailsQueryWithoutCph,
        { sbi: credentials.sbi, crn: credentials.crn },
        credentials.sessionId
      )
    })

    test('should map and return the DAL response when it contains data', async () => {
      const result = await fetchBusinessDetailsService(credentials)

      expect(dalConnector).toHaveBeenCalled()
      expect(mockMapBusinessDetails).toHaveBeenCalledWith(getDalData())
      expect(result).toEqual(getMappedData())
    })

    test('should return the raw DAL response when it has no data property', async () => {
      const errorResponse = { error: 'error response from dal' }
      dalConnector.mockResolvedValue(errorResponse)

      const result = await fetchBusinessDetailsService(credentials)

      expect(mockMapBusinessDetails).not.toHaveBeenCalled()
      expect(result).toEqual(errorResponse)
    })
  })
})
