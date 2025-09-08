// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'
import { dalConnector } from '../../../../src/dal/connector.js'
import { updateBusinessVATMutation } from '../../../../src/dal/mutations/update-business-vat.js'

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

vi.mock('../../../../src/dal/connector.js', () => ({
  dalConnector: vi.fn().mockResolvedValue({
    data: {
      updateBusinessVAT: {
        business: {
          info: {
            vatNumber: null
          }
        }
      }
    }
  })
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
    credentials = { sbi: '123456789', crn: '987654321' }
  })

  describe('when confirmRemove is "yes"', () => {
    test('it correctly saves the data to the session with VAT set to empty string', async () => {
      await updateBusinessVatRemoveService(yar, credentials)

      expect(fetchBusinessDetailsService).toHaveBeenCalledWith(yar, credentials)
      expect(mappedData.info.vat).toBe('')
      expect(yar.set).toHaveBeenCalledWith('businessDetails', mappedData)
    })

    test('it calls dalConnector with correct mutation and variable', async () => {
      await updateBusinessVatRemoveService(yar, credentials)

      expect(dalConnector).toHaveBeenCalledWith(updateBusinessVATMutation, {
        input: {
          vat: '',
          sbi: '107183280'
        }
      })
    })

    test('adds a flash notification confirming the VAT removal', async () => {
      await updateBusinessVatRemoveService(yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(yar, 'Success', 'You have removed your VAT registration number')
    })
  })

  describe('when an update fails', () => {
    beforeEach(() => {
      dalConnector.mockResolvedValue({
        errors: [{
          message: 'Failed to update'
        }]
      })
    })

    test('rejects with "DAL error from mutation"', async () => {
      await expect(updateBusinessVatRemoveService(yar, credentials))
        .rejects.toThrow('DAL error from mutation')
    })
  })
})
