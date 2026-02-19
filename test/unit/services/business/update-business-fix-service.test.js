// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessFixService } from '../../../../src/services/business/fetch-business-fix-service.js'
import { buildBusinessSuccessMessage } from '../../../../src/services/business/build-business-success-message-service.js'
import { buildBusinessUpdateVariables } from '../../../../src/services/business/build-business-update-variables-service.js'
import { updateDalService } from '../../../../src/services/DAL/update-dal-service.js'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'

// Thing under test
import { updateBusinessFixService } from '../../../../src/services/business/update-business-fix-service.js'

// Test helpers
import { updateBusinessDetailsMutation } from '../../../../src/dal/mutations/business/update-business-details.js'

// Mocks
vi.mock('../../../../src/services/business/fetch-business-fix-service.js', () => ({
  fetchBusinessFixService: vi.fn()
}))

vi.mock('../../../../src/services/business/build-business-success-message-service.js', () => ({
  buildBusinessSuccessMessage: vi.fn()
}))

vi.mock('../../../../src/services/business/build-business-update-variables-service.js', () => ({
  buildBusinessUpdateVariables: vi.fn()
}))

vi.mock('../../../../src/services/DAL/update-dal-service.js', () => ({
  updateDalService: vi.fn()
}))

vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

describe('updateBusinessFixService', () => {
  let sessionData
  let yar
  let credentials
  let businessDetails
  let updateVariables

  beforeEach(() => {
    vi.clearAllMocks()

    sessionData = { some: 'session-data' }

    yar = {
      clear: vi.fn()
    }

    credentials = {
      crn: '123456789',
      email: 'test@example.com'
    }

    businessDetails = {
      crn: '123456789',
      changeBusinessEmail: true
    }

    updateVariables = {
      updateBusinessEmailInput: {}
    }

    fetchBusinessFixService.mockResolvedValue(businessDetails)
    buildBusinessUpdateVariables.mockReturnValue(updateVariables)
    buildBusinessSuccessMessage.mockReturnValue({
      type: 'text',
      value: 'You have updated your business email address'
    })
  })

  describe('when called', () => {
    test('it fetches the business details using credentials and session data', async () => {
      await updateBusinessFixService(sessionData, yar, credentials)

      expect(fetchBusinessFixService).toHaveBeenCalledWith(credentials, sessionData)
    })

    test('it builds mutation variables from business details', async () => {
      await updateBusinessFixService(sessionData, yar, credentials)

      expect(buildBusinessUpdateVariables).toHaveBeenCalledWith(businessDetails)
    })

    test('it calls the DAL update service with the correct mutation and variables', async () => {
      await updateBusinessFixService(sessionData, yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(updateBusinessDetailsMutation, updateVariables)
    })

    test('it clears businessDetails from the session', async () => {
      await updateBusinessFixService(sessionData, yar, credentials)

      expect(yar.clear).toHaveBeenCalledWith('businessDetails')
    })

    test('it flashes a success notification', async () => {
      await updateBusinessFixService(sessionData, yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(
        yar,
        'Success',
        'You have updated your business email address'
      )
    })

    describe('when the success message is html', () => {
      beforeEach(() => {
        buildBusinessSuccessMessage.mockReturnValue({
          type: 'html',
          value: '<p>You have updated your business email address</p>'
        })
      })

      test('it flashes a success notification with html content', async () => {
        await updateBusinessFixService(sessionData, yar, credentials)

        expect(flashNotification).toHaveBeenCalledWith(
          yar,
          'Success',
          null,
          '<p>You have updated your business email address</p>'
        )
      })
    })
  })
})
