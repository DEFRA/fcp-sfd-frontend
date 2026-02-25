// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'
import { updateDalService } from '../../../../src/services/DAL/update-dal-service.js'
import { updatePersonalDobMutation } from '../../../../src/dal/mutations/personal/update-personal-dob.js'

// Test helpers
import { getMappedData } from '../../../mocks/mock-personal-details.js'

// Thing under test
import { updatePersonalDobChangeService } from '../../../../src/services/personal/update-personal-dob-change-service.js'

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

describe('updatePersonalDobChangeService', () => {
  let yar
  let credentials
  let data

  beforeEach(() => {
    vi.clearAllMocks()

    data = getMappedData()
    data.changePersonalDob = {
      day: '23',
      month: '07',
      year: '1964'
    }

    fetchPersonalChangeService.mockReturnValue(data)

    yar = {
      clear: vi.fn()
    }

    credentials = { crn: '987654321', sessionId: 'test-session-id' }
  })

  describe('when called', () => {
    test('it fetches the personal details with credentials', async () => {
      await updatePersonalDobChangeService(yar, credentials)

      expect(fetchPersonalChangeService).toHaveBeenCalledWith(yar, credentials, 'changePersonalDob')
    })

    test('it calls updateDalService with correct mutation and variables', async () => {
      await updatePersonalDobChangeService(yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(updatePersonalDobMutation, {
        input: {
          dateOfBirth: '1964-07-23',
          crn: data.crn
        }
      }, credentials.sessionId)
    })

    test('it clears the personalDetailsUpdate from session', async () => {
      await updatePersonalDobChangeService(yar, credentials)

      expect(yar.clear).toHaveBeenCalledWith('personalDetailsUpdate')
    })

    test('adds a flash notification confirming the change in data', async () => {
      await updatePersonalDobChangeService(yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(yar, 'Success', 'You have updated your date of birth')
    })
  })
})
