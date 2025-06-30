// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

const mockDalConnector = vi.fn()
vi.mock('../../../../src/dal/connector.js', () => ({
  dalConnector: mockDalConnector
}))

// Thing under test
const { fetchBusinessDetailsService } = await import('../../../../src/services/business/fetch-business-details-service.js')

describe('fetchBusinessDetailsService', () => {
  let yar

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when sessionData is null', () => {
    beforeEach(() => {
      yar = {
        get: vi.fn().mockReturnValue(null)
      }
    })

    test('it correctly returns data from the DAL', async () => {
      mockDalConnector.mockResolvedValue(getMockData())
      const result = await fetchBusinessDetailsService(yar)
      expect(result).toMatchObject(getMockData().data)
    })
  })

  describe('when businessDetailsUpdated is true', () => {
    beforeEach(() => {
      yar = {
        get: vi.fn().mockReturnValue(getSessionData(true))
      }
    })

    test('it correctly returns data from the DAL', async () => {
      mockDalConnector.mockResolvedValue(getMockData())
      const result = await fetchBusinessDetailsService(yar)
      expect(result).toEqual(getMockData().data)
    })
  })

  describe('when businessDetailsUpdated is false', () => {
    beforeEach(() => {
      yar = {
        get: vi.fn().mockReturnValue(getSessionData(false))
      }
    })

    test('it correctly returns the session data', async () => {
      const result = await fetchBusinessDetailsService(yar)

      expect(result).toEqual(getSessionData(false))
    })
  })
})

const getSessionData = (businessDetailsUpdated) => {
  return {
    data: {
      business: {
        info: {
          name: 'Farm Name'
        }
      }
    },
    businessDetailsUpdated
  }
}

const getMockData = () => {
  return {
    data: {
      business: {
        info: {
          name: 'Farm Name'
        }
      }
    }
  }
}
