// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
const mockDalConnector = vi.fn()
vi.mock('../../../../src/dal/connector.js', () => ({
  dalConnector: mockDalConnector
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

    test('it correctly returns data from the DAL', async () => {
      mockDalConnector.mockResolvedValue(data)

      const result = await fetchBusinessDetailsService(yar)

      expect(result).toMatchObject(mappedDalData)
    })

    describe('When the dal response contains no data property', () => {
      test('it returns the full response object', async () => {
        const dalErrorResponse = { error: 'error response from dal' }
        mockDalConnector.mockResolvedValue(dalErrorResponse)

        const result = await fetchBusinessDetailsService(yar)

        expect(result).toMatchObject(dalErrorResponse)
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
