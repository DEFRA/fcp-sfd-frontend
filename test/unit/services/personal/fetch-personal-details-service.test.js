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
  config: { get: mockConfigGet }
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
    mockConfigGet.mockReset()

    data = { data: getDalData() }
    mappedDalData = getMappedData()

    credentials = {
      crn: '64363553663',
      email: 'test.farmer@test.farm.com',
      sbi: '123456789'
    }
  })

  describe('when dalConnectionEnabled is true', () => {
    beforeEach(() => {
      dalConnector.mockResolvedValue(data)
      mockMappedValue.mockResolvedValue(mappedDalData)
    })

    test('dalConnector is called', async () => {
      await fetchPersonalDetailsService(credentials, { dalConnectionEnabled: true })

      expect(dalConnector).toHaveBeenCalled()
    })

    test('it correctly returns mappedData if dalConnector response has object data', async () => {
      const result = await fetchPersonalDetailsService(credentials, { dalConnectionEnabled: true })

      expect(result).toMatchObject(mappedDalData)
    })

    test('it returns the full response object if dalConnector response has no object data', async () => {
      const dalErrorResponse = { error: 'error response from dal' }
      dalConnector.mockResolvedValue(dalErrorResponse)
      const result = await fetchPersonalDetailsService(credentials, { dalConnectionEnabled: true })

      expect(result).toMatchObject(dalErrorResponse)
    })
  })

  describe('when dalConnectionEnabled is false', () => {
    test('dalConnector is not called', async () => {
      await fetchPersonalDetailsService(credentials, { dalConnectionEnabled: false })

      expect(dalConnector).not.toHaveBeenCalled()
    })

    test('it correctly returns data static data source', async () => {
      const result = await fetchPersonalDetailsService(credentials, { dalConnectionEnabled: false })

      expect(result).toMatchObject(getMappedData())
    })
  })

  describe('when options are not passed (uses config)', () => {
    test('uses DAL when config.get returns true', async () => {
      mockConfigGet.mockReturnValue(true)
      dalConnector.mockResolvedValue(data)
      mockMappedValue.mockResolvedValue(mappedDalData)

      const result = await fetchPersonalDetailsService(credentials)

      expect(dalConnector).toHaveBeenCalled()
      expect(result).toMatchObject(mappedDalData)
    })

    test('returns static data when config.get returns false', async () => {
      mockConfigGet.mockReturnValue(false)

      const result = await fetchPersonalDetailsService(credentials)

      expect(dalConnector).not.toHaveBeenCalled()
      expect(result).toMatchObject(getMappedData())
    })
  })
})
