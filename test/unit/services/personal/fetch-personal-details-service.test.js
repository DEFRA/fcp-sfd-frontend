// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
const mockMappedValue = vi.fn()
const mockDalConnector = { query: vi.fn() }

vi.mock('../../../../src/dal/connector.js', () => ({
  getDalConnector: vi.fn(() => mockDalConnector)
}))

vi.mock('@defra/fcp-sfd-frontend-engine', () => ({
  mappers: {
    personalDetails: mockMappedValue
  }
}))

// Test helpers
const { getMappedData, getDalData } = await import('../../../mocks/mock-personal-details.js')

// Thing under test
const { fetchPersonalDetailsService } = await import('../../../../src/services/personal/fetch-personal-details-service.js')

describe('fetchPersonalDetailsService', () => {
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
    beforeEach(() => {
      mockDalConnector.query.mockResolvedValue(data)
      // The engine mapper doesn't know about `business`, the service attaches it separately
      const mappedWithoutBusiness = {
        crn: mappedDalData.crn,
        userName: mappedDalData.userName,
        fullName: mappedDalData.fullName,
        fullNameJoined: mappedDalData.fullNameJoined,
        dateOfBirth: mappedDalData.dateOfBirth,
        address: mappedDalData.address,
        email: mappedDalData.email,
        telephone: mappedDalData.telephone,
        mobile: mappedDalData.mobile
      }
      mockMappedValue.mockReturnValue(mappedWithoutBusiness)
    })

    test('calls DAL connector with credentials values', async () => {
      await fetchPersonalDetailsService(credentials)

      expect(mockDalConnector.query).toHaveBeenCalledWith(
        expect.any(String),
        { crn: credentials.crn, sbi: credentials.sbi },
        { sessionId: credentials.sessionId }
      )
    })

    test('returns mapped data when DAL response includes data', async () => {
      const result = await fetchPersonalDetailsService(credentials)

      expect(result).toMatchObject(mappedDalData)
    })

    test('throws when DAL response contains errors', async () => {
      const dalErrorResponse = {
        data: null,
        errors: [{ message: 'error response from dal' }],
        statusCode: 500
      }
      mockDalConnector.query.mockResolvedValue(dalErrorResponse)
      await expect(fetchPersonalDetailsService(credentials))
        .rejects.toThrowError('Failed to retrieve personal details')

      expect(mockMappedValue).not.toHaveBeenCalled()
    })
  })
})
