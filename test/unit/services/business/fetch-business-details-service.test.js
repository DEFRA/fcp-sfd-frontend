// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { businessDetailsQuery, businessDetailsQueryWithoutCph } from '../../../../src/dal/queries/business-details.js'

// Test helpers
import { getMappedData, getDalData } from '../../../mocks/mock-business-details.js'

// Mock dependencies
const mockMapBusinessDetails = vi.fn()
const mockConfigValues = {}
const mockDalConnector = { query: vi.fn() }

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
      mockDalConnector.query.mockResolvedValue({ data: getDalData() })
      mockMapBusinessDetails.mockReturnValue(getMappedData())
    })

    test('should call DAL connector with businessDetailsQuery and credentials', async () => {
      await fetchBusinessDetailsService(credentials)

      expect(mockDalConnector.query).toHaveBeenCalledWith(
        businessDetailsQuery,
        { sbi: credentials.sbi, crn: credentials.crn },
        { sessionId: credentials.sessionId }
      )
    })

    test('should return mapped data when DAL response includes data', async () => {
      const result = await fetchBusinessDetailsService(credentials)

      expect(mockDalConnector.query).toHaveBeenCalled()
      expect(mockMapBusinessDetails).toHaveBeenCalledWith(getDalData())
      expect(result).toEqual(getMappedData())
    })

    test('should throw when DAL response contains errors', async () => {
      const errorResponse = {
        data: null,
        errors: [{ message: 'error response from dal' }],
        statusCode: 500
      }
      mockDalConnector.query.mockResolvedValue(errorResponse)

      await expect(fetchBusinessDetailsService(credentials))
        .rejects.toThrowError('Failed to retrieve business details')

      expect(mockMapBusinessDetails).not.toHaveBeenCalled()
    })
  })

  describe('when CPH_ENABLED is false', () => {
    beforeEach(() => {
      Object.assign(mockConfigValues, {
        'featureToggle.cphEnabled': false
      })
      mockDalConnector.query.mockResolvedValue({ data: getDalData() })
      mockMapBusinessDetails.mockReturnValue(getMappedData())
    })

    test('should call DAL connector with businessDetailsQueryWithoutCph and credentials', async () => {
      await fetchBusinessDetailsService(credentials)

      expect(mockDalConnector.query).toHaveBeenCalledWith(
        businessDetailsQueryWithoutCph,
        { sbi: credentials.sbi, crn: credentials.crn },
        { sessionId: credentials.sessionId }
      )
    })

    test('should return mapped data when DAL response includes data', async () => {
      const result = await fetchBusinessDetailsService(credentials)

      expect(mockDalConnector.query).toHaveBeenCalled()
      expect(mockMapBusinessDetails).toHaveBeenCalledWith(getDalData())
      expect(result).toEqual(getMappedData())
    })

    test('should throw when DAL response contains errors', async () => {
      const errorResponse = {
        data: null,
        errors: [{ message: 'error response from dal' }],
        statusCode: 500
      }
      mockDalConnector.query.mockResolvedValue(errorResponse)

      await expect(fetchBusinessDetailsService(credentials))
        .rejects.toThrowError('Failed to retrieve business details')

      expect(mockMapBusinessDetails).not.toHaveBeenCalled()
    })
  })
})
