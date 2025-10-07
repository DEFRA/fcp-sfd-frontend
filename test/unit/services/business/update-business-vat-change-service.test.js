// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Mocks
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'
import { dalConnector } from '../../../../src/dal/connector.js'
import { updateBusinessVATMutation } from '../../../../src/dal/mutations/update-business-vat.js'
import { getUserSessionToken } from '../../../../src/utils/get-user-session-token.js'

// Test helpers
import { mappedData as originalMappedData } from '../../../mocks/mock-business-details.js'

// Thing under test
import { updateBusinessVatChangeService } from '../../../../src/services/business/update-business-vat-change-service'

// Mock modules
vi.mock('../../../../src/services/business/fetch-business-details-service', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

vi.mock('../../../../src/dal/connector.js', () => ({
  dalConnector: vi.fn().mockResolvedValue({
    data: {
      updateBusinessVat: {
        business: {
          info: {
            vatNumber: 'GB123456798'
          }
        }
      }
    }
  })
}))

describe('updateBusinessVatChangeService', () => {
  let yar
  let credentials

  beforeEach(() => {
    vi.clearAllMocks()

    // Clone mock data to avoid test interference
    const clonedData = JSON.parse(JSON.stringify(originalMappedData))
    clonedData.changeBusinessVat = 'GB123456789'

    fetchBusinessDetailsService.mockReturnValue(clonedData)

    dalConnector.mockResolvedValue({
      data: {
        updateBusinessVat: { success: true }
      }
    })

    yar = {
      set: vi.fn()
    }

    credentials = {
      sbi: '123456789',
      crn: '987654321',
      email: 'test@example.com',
      vatNumber: 'GB123456789'
    }
  })

  describe('when called', () => {
    test('it correctly saves the data to the session', async () => {
      await updateBusinessVatChangeService(yar, credentials)

      expect(fetchBusinessDetailsService).toHaveBeenCalledWith(yar, credentials, getUserSessionToken)

      expect(yar.set).toHaveBeenCalledWith(
        'businessDetails',
        expect.objectContaining({
          info: expect.objectContaining({
            vat: 'GB123456789'
          })
        })
      )

      const savedBusinessDetails = yar.set.mock.calls[0][1]
      expect(savedBusinessDetails.changeBusinessVat).toBeUndefined()
    })

    test('it calls dalConnector with correct mutation and variable', async () => {
      await updateBusinessVatChangeService(yar, credentials)

      expect(dalConnector).toHaveBeenCalledWith(updateBusinessVATMutation, {
        input: {
          vat: 'GB123456789',
          sbi: '107183280'
        }
      }, getUserSessionToken)
    })

    test('adds a flash notification confirming the VAT change', async () => {
      await updateBusinessVatChangeService(yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(
        yar,
        'Success',
        'You have updated your VAT registration number'
      )
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
      await expect(updateBusinessVatChangeService(yar, credentials))
        .rejects.toThrow('DAL error from mutation')
    })
  })
})
