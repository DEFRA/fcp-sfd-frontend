// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchPersonalFixService } from '../../../../src/services/personal/fetch-personal-fix-service.js'
import { buildPersonalSuccessMessage } from '../../../../src/services/personal/build-personal-success-message-service.js'
import { buildPersonalUpdateVariables } from '../../../../src/services/personal/build-personal-update-variables-service.js'
import { updateDalService } from '../../../../src/services/DAL/update-dal-service.js'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'

// Thing under test
import { updatePersonalFixService } from '../../../../src/services/personal/update-personal-fix-service.js'

// Test helpers
import { updatePersonalDetailsMutation } from '../../../../src/dal/mutations/personal/update-personal-details.js'

// Mocks
vi.mock('../../../../src/services/personal/fetch-personal-fix-service.js', () => ({
  fetchPersonalFixService: vi.fn()
}))

vi.mock('../../../../src/services/personal/build-personal-success-message-service.js', () => ({
  buildPersonalSuccessMessage: vi.fn()
}))

vi.mock('../../../../src/services/personal/build-personal-update-variables-service.js', () => ({
  buildPersonalUpdateVariables: vi.fn()
}))

vi.mock('../../../../src/services/DAL/update-dal-service.js', () => ({
  updateDalService: vi.fn()
}))

vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

describe('updatePersonalFixService', () => {
  let sessionData
  let yar
  let credentials
  let personalDetails
  let updateVariables

  beforeEach(() => {
    vi.clearAllMocks()

    sessionData = { some: 'session-data' }

    yar = {
      clear: vi.fn()
    }

    credentials = {
      crn: '123456789',
      email: 'test@example.com',
      sessionId: 'test-session-123'
    }

    personalDetails = {
      crn: '123456789',
      changePersonalEmail: true
    }

    updateVariables = {
      updateCustomerEmailInput: {}
    }

    fetchPersonalFixService.mockResolvedValue(personalDetails)
    buildPersonalUpdateVariables.mockReturnValue(updateVariables)
    buildPersonalSuccessMessage.mockReturnValue({
      type: 'text',
      value: 'You have updated your personal email address'
    })
  })

  describe('when called', () => {
    test('it fetches the personal details using credentials and session data', async () => {
      await updatePersonalFixService(sessionData, yar, credentials)

      expect(fetchPersonalFixService).toHaveBeenCalledWith(credentials, sessionData)
    })

    test('it builds mutation variables from personal details', async () => {
      await updatePersonalFixService(sessionData, yar, credentials)

      expect(buildPersonalUpdateVariables).toHaveBeenCalledWith(personalDetails)
    })

    test('it calls the DAL update service with the correct mutation and variables', async () => {
      await updatePersonalFixService(sessionData, yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(updatePersonalDetailsMutation, updateVariables, credentials.sessionId)
    })

    test('it clears personalDetails from the session', async () => {
      await updatePersonalFixService(sessionData, yar, credentials)

      expect(yar.clear).toHaveBeenCalledWith('personalDetails')
    })

    test('it flashes a success notification', async () => {
      await updatePersonalFixService(sessionData, yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(
        yar,
        'Success',
        'You have updated your personal email address'
      )
    })

    describe('when the success message is html', () => {
      beforeEach(() => {
        buildPersonalSuccessMessage.mockReturnValue({
          type: 'html',
          value: '<p>You have updated your personal email address</p>'
        })
      })

      test('it flashes a success notification with html content', async () => {
        await updatePersonalFixService(sessionData, yar, credentials)

        expect(flashNotification).toHaveBeenCalledWith(
          yar,
          'Success',
          null,
          '<p>You have updated your personal email address</p>'
        )
      })
    })
  })
})
