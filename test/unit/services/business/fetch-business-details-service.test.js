import { describe, test, expect, beforeEach, vi } from 'vitest'

const mockDalConnector = vi.fn()
vi.mock('../../../../src/dal/connector.js', () => ({
  dalConnector: mockDalConnector
}))

// Thing under test
const { fetchBusinessDetailsService } = await import('../../../../src/services/business/fetch-business-details-service.js')

describe('fetchBusinessDetailsService', () => {
  let data
  let mappedDalData
  let yar

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()

    const { mappedData, dalData } = await import('../../../mocks/mock-business-details.js')
    data = { data: dalData }
    mappedDalData = mappedData

    yar = {
      flash: vi.fn().mockReturnValue([{ title: 'Update', text: 'Business details updated successfully' }]),
      set: vi.fn().mockReturnValue(data),
      get: vi.fn().mockReturnValue(data)
    }
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
        get: vi.fn().mockReturnValue(getSessionData),
        set: vi.fn()
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
