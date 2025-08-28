// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'

// Test helpers
import { mappedData } from '../../../mocks/mock-business-details.js'

// Thing under test
import { updateBusinessVatRemoveService } from '../../../../src/services/business/update-business-vat-remove-service'

// Mocks
vi.mock('../../../../src/services/business/fetch-business-details-service', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

describe('updateBusinessVatRemoveService', () => {
  let yar
  let credentials

  beforeEach(() => {
    vi.clearAllMocks()

    mappedData.info.vat = 'GB123456789'
    fetchBusinessDetailsService.mockReturnValue(mappedData)

    yar = {
      set: vi.fn().mockReturnValue()
    }
    credentials = { sbi: '123456789', crn: '987654321', email: 'test@example.com' }
  })

  describe('when called', () => {
    test('it correctly saves the data to the session with VAT set to null', async () => {
      await updateBusinessVatRemoveService(yar, credentials)

      expect(fetchBusinessDetailsService).toHaveBeenCalledWith(yar, credentials)
      expect(mappedData.info.vat).toBeNull()
      expect(yar.set).toHaveBeenCalledWith('businessDetails', mappedData)
    })

    test('adds a flash notification confirming the VAT removal', async () => {
      await updateBusinessVatRemoveService(yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(yar, 'Success', 'You have removed your business VAT number')
    })
  })
})
