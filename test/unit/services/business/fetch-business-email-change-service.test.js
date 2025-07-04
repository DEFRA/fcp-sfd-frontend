import { describe, test, expect, beforeEach, vi } from 'vitest'
import { fetchBusinessEmailChangeService } from '../../../../src/services/business/fetch-business-email-change-service'
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service'
import { mappedData } from '../../../mocks/mock-business-details'

vi.mock('../../../../src/services/business/fetch-business-details-service', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

describe('fetchBusinessEmailChangeService', () => {
  let data
  let yar

  beforeEach(() => {
    vi.clearAllMocks()

    data = mappedData

    yar = {
      set: vi.fn().mockReturnValue(data),
      get: vi.fn().mockReturnValue(data)
    }
  })

  describe('when called', () => {
    test('it correctly returns the data', async () => {
      await fetchBusinessEmailChangeService(yar)
      expect(fetchBusinessDetailsService).toHaveBeenCalled(yar)
      expect(yar.get).toHaveBeenCalledWith('businessDetails')
    })
  })
})
