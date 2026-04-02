// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
const mockMappedValue = vi.fn()
const mockDalConnector = { query: vi.fn() }

vi.mock('../../../../src/dal/connector.js', () => ({
  getDalConnector: vi.fn(() => mockDalConnector)
}))

vi.mock('../../../../src/mappers/personal-details-mapper.js', () => ({
  mapPersonalDetails: mockMappedValue
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
      mockMappedValue.mockReturnValue(mappedDalData)
    })

    test('dalConnector is called', async () => {
      await fetchPersonalDetailsService(credentials)

      expect(mockDalConnector.query).toHaveBeenCalled()
    })

    test('it correctly returns mappedData if dalConnector response has object data', async () => {
      const result = await fetchPersonalDetailsService(credentials)

      expect(result).toMatchObject(mappedDalData)
    })

    test('it returns the full response object if dalConnector response has no object data', async () => {
      const dalErrorResponse = { error: 'error response from dal' }
      mockDalConnector.query.mockResolvedValue(dalErrorResponse)
      const result = await fetchPersonalDetailsService(credentials)

      expect(result).toMatchObject(dalErrorResponse)
    })
  })
})
