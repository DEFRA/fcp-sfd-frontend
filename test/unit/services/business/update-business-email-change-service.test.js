import { describe, test, expect, beforeEach, vi } from 'vitest'
import { updateBusinessEmailChangeService } from '../../../../src/services/business/update-business-email-change-service'
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'
import { mappedData } from '../../../mocks/mock-business-details.js'

vi.mock('../../../../src/services/business/fetch-business-details-service', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

describe('updateBusinessEmailChangeService', () => {
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
      await updateBusinessEmailChangeService(yar)
      expect(fetchBusinessDetailsService).toHaveBeenCalled(yar)
      expect(flashNotification).toHaveBeenCalled()
      expect(yar.get).toHaveBeenCalledWith('businessDetails')
      expect(yar.set).toHaveBeenCalledWith('businessDetails', data)
    })
  })
})
