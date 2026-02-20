// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { dalConnector } from '../../../src/dal/connector.js'
const mockMappedValue = vi.fn()
const mockConfigGet = vi.fn()

vi.mock('../../../src/dal/connector.js', () => ({
  dalConnector: vi.fn()
}))

vi.mock('../../../src/mappers/personal-business-details-mapper.js', () => ({
  mapPersonalBusinessDetails: mockMappedValue
}))

vi.mock('../../../src/config/index.js', () => ({
  config: {
    get: mockConfigGet
  }
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
      sbi: '123456789'
    }
  })

  describe('when DAL_CONNECTION is true', () => {
    beforeEach(async () => {
      mockConfigGet.mockReturnValue(true)
      dalConnector.mockResolvedValue(data)
      mockMappedValue.mockResolvedValue(mappedDalData)
    })

    test('dalConnector is called', async () => {
      await fetchPersonalBusinessDetailsService(credentials)

      expect(dalConnector).toHaveBeenCalled()
    })

    test('it correctly returns mappedData if dalConnector response has object data', async () => {
      const result = await fetchPersonalBusinessDetailsService(credentials)

      expect(result).toMatchObject(mappedDalData)
    })

    test('it returns the full response object if dalConnector response has no object data', async () => {
      const dalErrorResponse = { error: 'error response from dal' }
      dalConnector.mockResolvedValue(dalErrorResponse)
      const result = await fetchPersonalBusinessDetailsService(credentials)

      expect(result).toMatchObject(dalErrorResponse)
    })
  })

  describe('when DAL_CONNECTION is false', () => {
    beforeEach(async () => {
      mockConfigGet.mockReturnValue(false)
    })

    test('dalConnector is not called', async () => {
      await fetchPersonalBusinessDetailsService(credentials)

      expect(dalConnector).not.toHaveBeenCalled()
    })

    test('it correctly returns data static data source', async () => {
      const result = await fetchPersonalBusinessDetailsService(credentials)

      expect(result).toMatchObject(getMappedData())
    })
  })
})
