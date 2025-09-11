// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { dalConnector } from '../../../../src/dal/connector.js'

// Things we need to mock
const mockMappedValue = vi.fn()
const mockConfigGet = vi.fn()

vi.mock('../../../../src/dal/connector.js', () => ({
  dalConnector: vi.fn()
}))

vi.mock('../../../../src/mappers/business-details-mapper.js', () => ({
  mapBusinessDetails: mockMappedValue
}))

vi.mock('../../../../src/config/index.js', () => ({
  config: {
    get: mockConfigGet
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
      mockConfigGet.mockReturnValue(true)
      dalConnector.mockResolvedValue(data)
      mockMappedValue.mockResolvedValue(mappedDalData)
    })

    test('dalConnector is called', async () => {
      await fetchBusinessDetailsService(credentials)

      expect(dalConnector).toHaveBeenCalled()
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
      mockConfigGet.mockReturnValue(false)
    })

    test('dalConnector is not called', async () => {
      await fetchBusinessDetailsService(credentials)

      expect(dalConnector).not.toHaveBeenCalled()
    })

    test('it correctly returns data static data source', async () => {
      const result = await fetchBusinessDetailsService(credentials)

      expect(result).toMatchObject(mappedData)
    })
  })
})
