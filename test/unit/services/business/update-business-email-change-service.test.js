// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'

// Test helpers
import { mappedData } from '../../../mocks/mock-business-details.js'

// Thing under test
import { updateBusinessEmailChangeService } from '../../../../src/services/business/update-business-email-change-service'

// Mocks
vi.mock('../../../../src/services/business/fetch-business-details-service', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

describe('updateBusinessEmailChangeService', () => {
  let yar

  beforeEach(() => {
    vi.clearAllMocks()

    mappedData.changeBusinessEmail = 'new-email@test.com'
    fetchBusinessDetailsService.mockReturnValue(mappedData)

    yar = {
      set: vi.fn().mockReturnValue()
    }
  })

  describe('when called', () => {
    test('it correctly saves the data to the session', async () => {
      await updateBusinessEmailChangeService(yar)

      expect(fetchBusinessDetailsService).toHaveBeenCalled(yar)
      expect(yar.set).toHaveBeenCalledWith('businessDetails', mappedData)
    })

    test('adds a flash notification confirming the change in data', async () => {
      await updateBusinessEmailChangeService(yar)

      expect(flashNotification).toHaveBeenCalledWith(yar, 'Success', 'You have updated your business email')
    })
  })
})
