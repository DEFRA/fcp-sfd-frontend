import { describe, test, expect, beforeEach, vi } from 'vitest'
import { updateBusinessPhoneNumbersChangeService } from '../../../../src/services/business/update-business-phone-numbers-change-service'
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'
import { dalData } from '../../../mockObjects/mock-business-details'

vi.mock('../../../../src/services/business/fetch-business-details-service', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

describe('updateBusinessPhoneNumbersChangeService', () => {
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
      await updateBusinessPhoneNumbersChangeService(yar)
      expect(fetchBusinessDetailsService).toHaveBeenCalled(yar)
      expect(flashNotification).toHaveBeenCalled()
      expect(yar.get).toHaveBeenCalledWith('businessDetails')
      expect(yar.set).toHaveBeenCalledWith('businessDetails', data)
    })
  })
})
