import { describe, test, expect, beforeEach, vi } from 'vitest'
import { updateBusinessNameChangeService } from '../../../../src/services/business/update-business-name-change-service.js'
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'
import { dalData } from '../../../mockObjects/mock-business-details'

vi.mock('../../../../src/services/business/fetch-business-details-service.js', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

describe('updateBusinessNameChangeService', () => {
  let data
  let yar

  beforeEach(() => {
    vi.clearAllMocks()

    data = dalData
    yar = {
      get: vi.fn().mockReturnValue(data),
      set: vi.fn().mockReturnValue(data)
    }
  })

  describe('when called', () => {
    test('it correctly returns the data', async () => {
      await updateBusinessNameChangeService(yar)
      expect(fetchBusinessDetailsService).toHaveBeenCalled(yar)
      expect(flashNotification).toHaveBeenCalled()
      expect(yar.get).toHaveBeenCalledWith('businessDetails')
      expect(yar.set).toHaveBeenCalledWith('businessDetails', data)
    })
  })
})
