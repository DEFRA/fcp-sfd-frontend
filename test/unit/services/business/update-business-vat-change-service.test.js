// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Mocks
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'
import { updateDalService } from '../../../../src/services/DAL/update-dal-service.js'
import { updateBusinessVATMutation } from '../../../../src/dal/mutations/business/update-business-vat.js'

// Test helpers
import { mappedData } from '../../../mocks/mock-business-details.js'

// Thing under test
import { updateBusinessVatChangeService } from '../../../../src/services/business/update-business-vat-change-service'

// Mocks
vi.mock('../../../../src/services/business/fetch-business-change-service', () => ({
  fetchBusinessChangeService: vi.fn()
}))

vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

vi.mock('../../../../src/services/DAL/update-dal-service.js', () => ({
  updateDalService: vi.fn().mockResolvedValue({})
}))

describe('updateBusinessVatChangeService', () => {
  let yar
  let credentials

  beforeEach(() => {
    vi.clearAllMocks()

    mappedData.changeBusinessVat = 'GB123456789'
    fetchBusinessChangeService.mockReturnValue(mappedData)

    yar = {
      clear: vi.fn()
    }

    credentials = { sbi: '123456789', crn: '987654321', sessionId: 'test-session-id' }
  })

  describe('when called', () => {
    test('it fetches the business details with credentials', async () => {
      await updateBusinessVatChangeService(yar, credentials)

      expect(fetchBusinessChangeService).toHaveBeenCalledWith(yar, credentials, 'changeBusinessVat')
    })

    test('it calls updateDalService with correct mutation and variables', async () => {
      await updateBusinessVatChangeService(yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(updateBusinessVATMutation, {
        input: {
          vat: 'GB123456789',
          sbi: '107183280'
        }
      }, credentials.sessionId)
    })

    test('it clears the businessDetails from session', async () => {
      await updateBusinessVatChangeService(yar, credentials)

      expect(yar.clear).toHaveBeenCalledWith('businessDetailsUpdate')
    })

    test('adds a flash notification confirming the change in data', async () => {
      await updateBusinessVatChangeService(yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(yar, 'Success', 'You have updated your VAT registration number')
    })
  })
})
