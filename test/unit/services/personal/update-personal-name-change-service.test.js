// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'
import { updateDalService } from '../../../../src/services/DAL/update-dal-service.js'
import { updatePersonalNameMutation } from '../../../../src/dal/mutations/personal/update-personal-name.js'

// Test helpers
import { mappedData } from '../../../mocks/mock-personal-details.js'

// Thing under test
import { updatePersonalNameChangeService } from '../../../../src/services/personal/update-personal-name-change-service.js'

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

describe('updatePersonalNameChangeService', () => {
  let yar
  let credentials

  beforeEach(() => {
    vi.clearAllMocks()

    mappedData.changePersonalName = {
      first: 'John',
      last: 'Doe',
      middle: 'M'
    }

    fetchPersonalChangeService.mockReturnValue(mappedData)

    yar = {
      clear: vi.fn()
    }

    credentials = { crn: '987654321' }
  })

  describe('when called', () => {
    test('it fetches the personal details with credentials', async () => {
      await updatePersonalNameChangeService(yar, credentials)

      expect(fetchPersonalChangeService).toHaveBeenCalledWith(yar, credentials, 'changePersonalName')
    })

    test('it calls updateDalService with correct mutation and variables', async () => {
      await updatePersonalNameChangeService(yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(updatePersonalNameMutation, {
        input: {
          first: 'John',
          last: 'Doe',
          middle: 'M',
          crn: mappedData.crn
        }
      })
    })

    describe('when middle names are null', () => {
      beforeEach(() => {
        mappedData.changePersonalName.middle = null
      })

      test('it calls updateDalService with null values', async () => {
        await updatePersonalNameChangeService(yar, credentials)

        expect(updateDalService).toHaveBeenCalledWith(updatePersonalNameMutation, {
          input: {
            first: 'John',
            last: 'Doe',
            middle: null,
            crn: mappedData.crn
          }
        })
      })
    })

    test('it clears the personalDetails from session', async () => {
      await updatePersonalNameChangeService(yar, credentials)

      expect(yar.clear).toHaveBeenCalledWith('personalDetails')
    })

    test('adds a flash notification confirming the change in data', async () => {
      await updatePersonalNameChangeService(yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(yar, 'Success', 'You have updated your personal name')
    })
  })
})
