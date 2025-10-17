// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'
import { updateDalService } from '../../../../src/services/DAL/update-dal-service.js'
import { updatePersonalEmailMutation } from '../../../../src/dal/mutations/personal/update-personal-email.js'

// Test helpers
import { mappedData } from '../../../mocks/mock-personal-details.js'

// Thing under test
import { updatePersonalEmailChangeService } from '../../../../src/services/personal/update-personal-email-change-service.js'

// Mocks
vi.mock('../../../../src/services/personal/fetch-personal-change-service.js', () => ({
  fetchPersonalChangeService: vi.fn()
}))

vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

vi.mock('../../../../src/services/DAL/update-dal-service.js', () => ({
  updateDalService: vi.fn().mockResolvedValue({})
}))

describe('updatePersonalEmailChangeService', () => {
  let yar
  let credentials

  beforeEach(() => {
    vi.clearAllMocks()

    mappedData.changePersonalEmail = 'new-email@test.com'
    fetchPersonalChangeService.mockReturnValue(mappedData)

    yar = {
      clear: vi.fn()
    }

    credentials = { crn: '987654321' }
  })

  describe('when called', () => {
    test('it fetches the personal details with credentials', async () => {
      await updatePersonalEmailChangeService(yar, credentials)

      expect(fetchPersonalChangeService).toHaveBeenCalledWith(yar, credentials, 'changePersonalEmail')
    })

    test('it calls updateDalService with correct mutation and variables', async () => {
      await updatePersonalEmailChangeService(yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(updatePersonalEmailMutation, {
        input: {
          email: {
            address: 'new-email@test.com'
          },
          crn: mappedData.crn
        }
      })
    })

    test('it clears the personalDetails from session', async () => {
      await updatePersonalEmailChangeService(yar, credentials)

      expect(yar.clear).toHaveBeenCalledWith('personalDetails')
    })

    test('adds a flash notification confirming the change in data', async () => {
      await updatePersonalEmailChangeService(yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(yar, 'Success', 'You have updated your personal email address')
    })
  })
})
