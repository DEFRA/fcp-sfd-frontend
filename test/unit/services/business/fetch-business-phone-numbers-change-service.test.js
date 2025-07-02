import { describe, test, expect, beforeEach, vi } from 'vitest'
import { fetchBusinessPhoneNumbersChangeService } from '../../../../src/services/business/fetch-business-phone-numbers-change-service'
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service'
import { dalData } from '../../../mockObjects/mock-business-details'

vi.mock('../../../../src/services/business/fetch-business-details-service', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

describe('fetchBusinessPhoneNumbersChangeService', () => {
  let data
  let yar

  beforeEach(() => {
    vi.clearAllMocks()

    data = dalData

    yar = {
      set: vi.fn().mockReturnValue(data),
      get: vi.fn().mockReturnValue(data)
    }
  })

  describe('when called', () => {
    test('it correctly returns the data', async () => {
      await fetchBusinessPhoneNumbersChangeService(yar)
      expect(fetchBusinessDetailsService).toHaveBeenCalled(yar)
      expect(yar.get).toHaveBeenCalledWith('businessDetails')
    })
  })
})
