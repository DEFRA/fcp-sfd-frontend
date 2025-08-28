// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { dalConnector } from '../../../../src/dal/connector.js'
import { updateBusinessEmailMutation } from '../../../../src/dal/mutations/update-business-email.js'
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

vi.mock('../../../../src/dal/connector.js', () => ({
  dalConnector: vi.fn().mockResolvedValue({
    data: {
      updateBusinessEmail: {
        business: {
          info: {
            email: {
              address: 'my-new-email@test.com'
            }
          }
        }
      }
    }
  })
}))

describe('updateBusinessEmailChangeService', () => {
  let yar
  let credentials

  beforeEach(() => {
    vi.clearAllMocks()

    mappedData.changeBusinessEmail = 'new-email@test.com'
    fetchBusinessDetailsService.mockReturnValue(mappedData)

    yar = {
      set: vi.fn().mockReturnValue()
    }
    credentials = { sbi: '123456789', crn: '987654321' }
  })

  describe('when called', () => {
    test('it correctly saves the data to the session', async () => {
      await updateBusinessEmailChangeService(yar, credentials)

      expect(fetchBusinessDetailsService).toHaveBeenCalledWith(yar, credentials)
      expect(yar.set).toHaveBeenCalledWith('businessDetails', mappedData)
    })

    test('it calls the dalConnector with  correct mutation and variables', async () => {
      await updateBusinessEmailChangeService(yar, credentials)

      expect(dalConnector).toHaveBeenCalledWith(updateBusinessEmailMutation, {
        input: { email: { address: 'new-email@test.com' }, sbi: '107183280' }
      })
    })

    test('adds a flash notification confirming the change in data', async () => {
      await updateBusinessEmailChangeService(yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(yar, 'Success', 'You have updated your business email address')
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
      await expect(updateBusinessEmailChangeService(yar, credentials))
        .rejects.toThrow('DAL error from mutation')
    })
  })
})
