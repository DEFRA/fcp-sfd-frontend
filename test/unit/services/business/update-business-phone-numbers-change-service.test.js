// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'
import { updateDalService } from '../../../../src/services/DAL/update-dal-service.js'
import { updateBusinessPhoneNumbersMutation } from '../../../../src/dal/mutations/business/update-business-phone-numbers.js'

// Test helpers
import { mappedData } from '../../../mocks/mock-business-details.js'

// Thing under test
import { updateBusinessPhoneNumbersChangeService } from '../../../../src/services/business/update-business-phone-numbers-change-service.js'

// Mocks
vi.mock('../../../../src/services/business/fetch-business-change-service.js', () => ({
  fetchBusinessChangeService: vi.fn()
}))

vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

vi.mock('../../../../src/services/DAL/update-dal-service.js', () => ({
  updateDalService: vi.fn().mockResolvedValue({})
}))

describe('updateBusinessPhoneNumbersChangeService', () => {
  let yar
  let credentials

  beforeEach(() => {
    vi.clearAllMocks()

    mappedData.changeBusinessPhoneNumbers = {
      businessTelephone: null,
      businessMobile: null
    }

    fetchBusinessChangeService.mockReturnValue(mappedData)

    yar = {
      clear: vi.fn()
    }

    credentials = { sbi: '123456789', crn: '987654321', sessionId: 'test-session-id' }
  })

  describe('when called', () => {
    test('it fetches the business details with credentials', async () => {
      await updateBusinessPhoneNumbersChangeService(yar, credentials)

      expect(fetchBusinessChangeService).toHaveBeenCalledWith(yar, credentials, 'changeBusinessPhoneNumbers')
    })

    test('it calls updateDalService with correct mutation and variables', async () => {
      await updateBusinessPhoneNumbersChangeService(yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(updateBusinessPhoneNumbersMutation, {
        input: {
          phone: {
            landline: null,
            mobile: null
          },
          sbi: mappedData.info.sbi
        }
      }, credentials.sessionId)
    })

    test('it clears the businessDetails from session', async () => {
      await updateBusinessPhoneNumbersChangeService(yar, credentials)

      expect(yar.clear).toHaveBeenCalledWith('businessDetailsUpdate')
    })

    test('adds a flash notification confirming the change in data', async () => {
      await updateBusinessPhoneNumbersChangeService(yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(yar, 'Success', 'You have updated your business phone numbers')
    })
  })
})
