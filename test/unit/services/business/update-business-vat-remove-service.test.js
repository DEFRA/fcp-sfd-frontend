// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Engine dependencies
import { constants, mutations } from '@defra/fcp-sfd-frontend-engine'

// Things we need to mock
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'
import { updateDalService } from '../../../../src/services/DAL/update-dal-service.js'

// Test helpers
import { getMappedData } from '../../../mocks/mock-business-details.js'

// Thing under test
import { updateBusinessVatRemoveService } from '../../../../src/services/business/update-business-vat-remove-service.js'

// Mocks
vi.mock('../../../../src/services/business/fetch-business-details-service.js', () => ({
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

    fetchBusinessDetailsService.mockReturnValue(getMappedData())

    credentials = { sbi: '123456789', crn: '987654321', sessionId: 'test-session-id' }
  })

  describe('when called', () => {
    test('it fetches the business details with credentials', async () => {
      await updateBusinessVatRemoveService(yar, credentials)

      expect(fetchBusinessDetailsService).toHaveBeenCalledWith(credentials)
    })

    test('it calls dalConnector with correct mutation and variable', async () => {
      await updateBusinessVatRemoveService(yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(mutations.updateBusinessVat, {
        input: {
          vat: '',
          sbi: '107183280'
        }
      }, credentials.sessionId)
    })

    test('adds a flash notification confirming the VAT removal', async () => {
      await updateBusinessVatRemoveService(yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(yar, 'Success', constants.successMessages.BUSINESS_VAT_REMOVE)
    })
  })
})
