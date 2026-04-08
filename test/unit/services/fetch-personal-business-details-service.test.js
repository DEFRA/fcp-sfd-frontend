// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
const mockMappedValue = vi.fn()
const mockDalConnector = { query: vi.fn() }

vi.mock('../../../src/dal/connector.js', () => ({
  getDalConnector: vi.fn(() => mockDalConnector)
}))

vi.mock('../../../src/mappers/personal-business-details-mapper.js', () => ({
  mapPersonalBusinessDetails: mockMappedValue
}))

// Test helpers
const { getMappedData, getDalData } = await import('../../mocks/mock-personal-business-details.js')

// Thing under test
const { fetchPersonalBusinessDetailsService } = await import('../../../src/services/fetch-personal-business-details-service.js')

describe('fetchPersonalBusinessDetailsService', () => {
  let data
  let credentials
  let mappedDalData

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()

    data = { data: getDalData() }
    mappedDalData = getMappedData()

    credentials = {
      crn: '64363553663',
      email: 'test.farmer@test.farm.com',
      sbi: '123456789',
      sessionId: 'test-session-id'
    }
  })

  describe('when fetching from the DAL', () => {
    beforeEach(async () => {
      mockDalConnector.query.mockResolvedValue(data)
      mockMappedValue.mockReturnValue(mappedDalData)
    })

    test('calls DAL connector with credentials values', async () => {
      await fetchPersonalBusinessDetailsService(credentials)

      expect(mockDalConnector.query).toHaveBeenCalledWith(
        expect.any(String),
        { crn: credentials.crn, sbi: credentials.sbi },
        credentials.sessionId
      )
    })

    test('returns mapped data when DAL response includes data', async () => {
      const result = await fetchPersonalBusinessDetailsService(credentials)

      expect(result).toMatchObject(mappedDalData)
    })

    test('returns raw DAL response when data is missing', async () => {
      const dalErrorResponse = {
        data: null,
        errors: [{ message: 'error response from dal' }],
        statusCode: 500
      }
      mockDalConnector.query.mockResolvedValue(dalErrorResponse)
      const result = await fetchPersonalBusinessDetailsService(credentials)

      expect(mockMappedValue).not.toHaveBeenCalled()
      expect(result).toMatchObject(dalErrorResponse)
      expect(result.errors).toBeDefined()
      expect(result.statusCode).toBe(500)
    })
  })
})
