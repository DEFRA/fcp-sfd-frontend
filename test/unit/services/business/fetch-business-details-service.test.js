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
  let mappedDalData
  let yar

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()

    data = { data: dalData }
    mappedDalData = mappedData
  })

  describe('when there is no session data in cache', () => {
    beforeEach(() => {
      yar = {
        get: vi.fn().mockReturnValue(null),
        set: vi.fn()
      }
    })
    describe('when DAL_CONNECTION is true', () => {
      beforeEach(() => {
        mockConfigGet.mockReturnValue(true)
        dalConnector.mockResolvedValue(data)
        mockMappedValue.mockResolvedValue(mappedDalData)
      })

      test('dalConnector is called', async () => {
        await fetchBusinessDetailsService(yar)
        expect(dalConnector).toHaveBeenCalled()
      })

      test('it correctly returns mappedData if dalConnector response has object data', async () => {
        const result = await fetchBusinessDetailsService(yar)
        expect(result).toMatchObject(mappedDalData)
      })

      test('it returns the full response object if dalConnector response has no object data', async () => {
        const dalErrorResponse = { error: 'error response from dal' }
        dalConnector.mockResolvedValue(dalErrorResponse)
        const result = await fetchBusinessDetailsService(yar)
        expect(result).toMatchObject(dalErrorResponse)
      })
    })

    describe('when DAL_CONNECTION is false', () => {
      beforeEach(() => {
        mockConfigGet.mockReturnValue(false)
        dalConnector.mockResolvedValue({})
        mockMappedValue.mockResolvedValue({})
      })
      test('dalConnector is not called', async () => {
        await fetchBusinessDetailsService(yar)
        expect(dalConnector).not.toHaveBeenCalled()
      })

      test('it correctly returns data static data source', async () => {
        const result = await fetchBusinessDetailsService(yar)
        expect(result).toMatchObject(mappedData)
      })
    })
  })

  describe('when there is session data in cache', () => {
    beforeEach(() => {
      yar = {
        get: vi.fn().mockReturnValue(getSessionData)
      }
    })

    test('it correctly returns session data', async () => {
      const result = await fetchBusinessDetailsService(yar)
      expect(result).toMatchObject(getSessionData)
    })
  })
})

const getSessionData = {
  data: {
    business: {
      info: {
        name: 'Farm Name From Cache'
      }
    }
  }
}
