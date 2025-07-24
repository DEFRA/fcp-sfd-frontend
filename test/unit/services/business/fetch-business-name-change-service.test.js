// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'

// Test helpers
import { mappedData } from '../../../mocks/mock-business-details'

// Thing under test
import { fetchBusinessNameChangeService } from '../../../../src/services/business/fetch-business-name-change-service.js'

// Mocks
vi.mock('../../../../src/services/business/fetch-business-details-service', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

describe('fetchBusinessNameChangeService', () => {
  const data = mappedData
  let yar
  let request

  beforeEach(() => {
    vi.clearAllMocks()

    yar = {
      set: vi.fn()
    }
    request = { yar }
  })

  describe('when called', () => {
    describe('and there is no changed name', () => {
      beforeEach(() => {
        fetchBusinessDetailsService.mockResolvedValue(data)
      })

      test('it returns the correct data', async () => {
        const result = await fetchBusinessNameChangeService(request)

        expect(fetchBusinessDetailsService).toHaveBeenCalled(request)
        expect(yar.set).toHaveBeenCalled(data)
        expect(result).toEqual({ ...data, changeBusinessName: 'HENLEY, RE' })
      })
    })

    describe('and there is a changed name', () => {
      beforeEach(() => {
        const newName = 'New business name ltd'

        mappedData.changeBusinessName = newName
        data.changeBusinessName = newName

        fetchBusinessDetailsService.mockResolvedValue(mappedData)
      })

      test('it returns the correct data', async () => {
        const result = await fetchBusinessNameChangeService(request)

        expect(fetchBusinessDetailsService).toHaveBeenCalled(request)
        expect(yar.set).toHaveBeenCalled(data)
        expect(result).toEqual(data)
      })
    })
  })
})
