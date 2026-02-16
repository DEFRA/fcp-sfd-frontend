// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'
import { updateDalService } from '../../../../src/services/DAL/update-dal-service.js'
import { updateBusinessVATMutation } from '../../../../src/dal/mutations/business/update-business-vat.js'

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

vi.mock('../../../../src/services/DAL/update-dal-service.js', () => ({
  updateDalService: vi.fn().mockResolvedValue({})
}))

describe('updateBusinessVatRemoveService', () => {
  let yar
  let credentials

  beforeEach(() => {
    vi.clearAllMocks()

    fetchBusinessDetailsService.mockReturnValue(mappedData)

    credentials = { sbi: '123456789', crn: '987654321', sessionId: 'test-session-id' }
  })

  describe('when called', () => {
    test('it fetches the business details with credentials', async () => {
      await updateBusinessVatRemoveService(yar, credentials)

      expect(fetchBusinessDetailsService).toHaveBeenCalledWith(credentials)
    })

    test('it calls dalConnector with correct mutation and variable', async () => {
      await updateBusinessVatRemoveService(yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(updateBusinessVATMutation, {
        input: {
          vat: '',
          sbi: '107183280'
        }
      }, credentials.sessionId)
    })

    test('adds a flash notification confirming the VAT removal', async () => {
      await updateBusinessVatRemoveService(yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(yar, 'Success', 'You have removed your VAT registration number')
    })
  })
})
