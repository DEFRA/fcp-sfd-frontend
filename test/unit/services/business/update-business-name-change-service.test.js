// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'

// Test helpers
import { mappedData } from '../../../mocks/mock-business-details.js'

// Thing under test
import { updateBusinessNameChangeService } from '../../../../src/services/business/update-business-name-change-service'

// Mocks
vi.mock('../../../../src/services/business/fetch-business-details-service', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

describe('updateBusinessNameChangeService', () => {
  let yar

  beforeEach(() => {
    vi.clearAllMocks()

    mappedData.changeBusinessName = 'New business ltd'
    fetchBusinessDetailsService.mockReturnValue(mappedData)

    yar = {
      set: vi.fn().mockReturnValue()
    }
  })

  describe('when called', () => {
    test('it correctly saves the data to the session', async () => {
      await updateBusinessNameChangeService(yar)

      expect(fetchBusinessDetailsService).toHaveBeenCalled(yar)
      expect(yar.set).toHaveBeenCalledWith('businessDetails', mappedData)
    })

    test('adds a flash notification confirming the change in data', async () => {
      await updateBusinessNameChangeService(yar)

      expect(flashNotification).toHaveBeenCalledWith(yar, 'Success', 'You have updated your business name')
    })
  })
})
