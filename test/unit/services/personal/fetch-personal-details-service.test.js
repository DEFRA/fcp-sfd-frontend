// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { dalConnector } from '../../../../src/dal/connector.js'
const mockMappedValue = vi.fn()
const mockConfigGet = vi.fn()

vi.mock('../../../../src/dal/connector.js', () => ({
  dalConnector: vi.fn()
}))

vi.mock('../../../../src/mappers/personal-details-mapper.js', () => ({
  mapPersonalDetails: mockMappedValue
}))

vi.mock('../../../../src/config/index.js', () => ({
  config: {
    get: mockConfigGet
  }
}))

// Test helpers
const { mappedData, dalData } = await import('../../../mocks/mock-personal-details.js')

// Thing under test
const { fetchPersonalDetailsService } = await import('../../../../src/services/personal/fetch-personal-details-service.js')

describe('fetchPersonalDetailsService', () => {
  let data
  let credentials
  let mappedDalData

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()

    data = { data: dalData }
    mappedDalData = mappedData

    credentials = {
      crn: '64363553663',
      email: 'test.farmer@test.farm.com'
    }
  })

  describe('when DAL_CONNECTION is true', () => {
    beforeEach(() => {
      mockConfigGet.mockReturnValue(true)
      dalConnector.mockResolvedValue(data)
      mockMappedValue.mockResolvedValue(mappedDalData)
    })

    test('dalConnector is called', async () => {
      await fetchPersonalDetailsService(credentials)

      expect(dalConnector).toHaveBeenCalled()
    })

    test('it correctly returns mappedData if dalConnector response has object data', async () => {
      const result = await fetchPersonalDetailsService(credentials)

      expect(result).toMatchObject(mappedDalData)
    })

    test('it returns the full response object if dalConnector response has no object data', async () => {
      const dalErrorResponse = { error: 'error response from dal' }
      dalConnector.mockResolvedValue(dalErrorResponse)
      const result = await fetchPersonalDetailsService(credentials)

      expect(result).toMatchObject(dalErrorResponse)
    })
  })

  describe('when DAL_CONNECTION is false', () => {
    beforeEach(() => {
      mockConfigGet.mockReturnValue(false)
    })
    test('dalConnector is not called', async () => {
      await fetchPersonalDetailsService(credentials)

      expect(dalConnector).not.toHaveBeenCalled()
    })

    test('it correctly returns data static data source', async () => {
      const result = await fetchPersonalDetailsService(credentials)

      expect(result).toMatchObject(mappedData)
    })
  })
})
