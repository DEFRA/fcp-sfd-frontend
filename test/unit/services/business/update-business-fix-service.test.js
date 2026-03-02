// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessFixService } from '../../../../src/services/business/fetch-business-fix-service.js'
import { buildBusinessDetailsMutationService } from '../../../../src/services/business/build-business-details-mutation-service.js'
import { buildBusinessSuccessMessage } from '../../../../src/services/business/build-business-success-message-service.js'
import { buildBusinessUpdateVariablesService } from '../../../../src/services/business/build-business-update-variables-service.js'
import { updateDalService } from '../../../../src/services/DAL/update-dal-service.js'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'

// Thing under test
import { updateBusinessFixService } from '../../../../src/services/business/update-business-fix-service.js'

// Mocks
vi.mock('../../../../src/services/business/fetch-business-fix-service.js', () => ({
  fetchBusinessFixService: vi.fn()
}))

vi.mock('../../../../src/services/business/build-business-update-variables-service.js', () => ({
  buildBusinessUpdateVariablesService: vi.fn()
}))

vi.mock('../../../../src/services/business/build-business-success-message-service.js', () => ({
  buildBusinessSuccessMessage: vi.fn()
}))

vi.mock('../../../../src/services/business/build-business-details-mutation-service.js', () => ({
  buildBusinessDetailsMutationService: vi.fn()
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
  let updateBusinessDetailsMutation

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

    businessDetails = {
      crn: '123456789',
      changeBusinessEmail: true,
      orderedSectionsToFix: ['email']
    }

    updateVariables = {
      updateBusinessEmailInput: {}
    }

    updateBusinessDetailsMutation = 'mutation Mutation ($updateBusinessEmailInput: UpdateBusinessEmailInput!)'

    fetchBusinessFixService.mockResolvedValue(businessDetails)
    buildBusinessUpdateVariablesService.mockReturnValue(updateVariables)
    buildBusinessDetailsMutationService.mockReturnValue(updateBusinessDetailsMutation)
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

      expect(buildBusinessUpdateVariablesService).toHaveBeenCalledWith(businessDetails)
    })

    test('it builds the business details mutation', async () => {
      await updateBusinessFixService(sessionData, yar, credentials)

      expect(buildBusinessDetailsMutationService).toHaveBeenCalledWith(businessDetails.orderedSectionsToFix)
    })

    test('it calls the DAL update service with the correct mutation and variables', async () => {
      await updateBusinessFixService(sessionData, yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(updateBusinessDetailsMutation, updateVariables, credentials.sessionId)
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
