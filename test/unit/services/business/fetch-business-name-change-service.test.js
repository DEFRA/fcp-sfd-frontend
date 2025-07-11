import { describe, test, expect, beforeEach, vi } from 'vitest'
import { fetchBusinessNameChangeService } from '../../../../src/services/business/fetch-business-name-change-service.js'
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'
import { dalData } from '../../../mocks/mock-business-details'

vi.mock('../../../../src/services/business/fetch-business-details-service.js', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

describe('fetchBusinessNameChangeService', () => {
  let data
  let yar

  beforeEach(() => {
    vi.clearAllMocks()

    data = dalData
    yar = {
      get: vi.fn().mockReturnValue(data)
    }
  })

  describe('when called', () => {
    test('it calls fetchBusinessDetailsService and returns business details with changeBusinessName', async () => {
      const result = await fetchBusinessNameChangeService(yar)

      expect(fetchBusinessDetailsService).toHaveBeenCalledWith(yar)
      expect(yar.get).toHaveBeenCalledWith('businessDetails')
      expect(result).toEqual({
        ...data,
        changeBusinessName: data.businessName
      })
    })
  })

  describe('when changeBusinessName exists in session', () => {
    test('it returns the existing changeBusinessName value', async () => {
      const sessionDataWithChange = {
        ...data,
        changeBusinessName: 'Updated Business Name Ltd'
      }
      yar.get.mockReturnValue(sessionDataWithChange)

      const result = await fetchBusinessNameChangeService(yar)

      expect(result).toEqual({
        ...sessionDataWithChange,
        changeBusinessName: 'Updated Business Name Ltd'
      })
    })
  })

  describe('when businessDetails is empty object', () => {
    test('it handles empty business details gracefully', async () => {
      yar.get.mockReturnValue({})

      const result = await fetchBusinessNameChangeService(yar)

      expect(fetchBusinessDetailsService).toHaveBeenCalledWith(yar)
      expect(result).toEqual({
        changeBusinessName: undefined
      })
    })
  })
})
