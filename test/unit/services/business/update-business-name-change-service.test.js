// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'
import { updateDalService } from '../../../../src/services/DAL/update-dal-service.js'
import { updateBusinessNameMutation } from '../../../../src/dal/mutations/business/update-business-name.js'

// Test helpers
import { mappedData } from '../../../mocks/mock-business-details.js'

// Thing under test
import { updateBusinessNameChangeService } from '../../../../src/services/business/update-business-name-change-service'

// Mocks
vi.mock('../../../../src/services/business/fetch-business-change-service', () => ({
  fetchBusinessChangeService: vi.fn()
}))

vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

vi.mock('../../../../src/services/DAL/update-dal-service.js', () => ({
  updateDalService: vi.fn().mockResolvedValue({})
}))

describe('updateBusinessNameChangeService', () => {
  let yar
  let credentials

  beforeEach(() => {
    vi.clearAllMocks()

    mappedData.changeBusinessName = 'New business ltd'
    fetchBusinessChangeService.mockReturnValue(mappedData)

    yar = {
      clear: vi.fn()
    }

    credentials = { sbi: '123456789', crn: '987654321' }
  })

  describe('when called', () => {
    test('it fetches the business details with credentials', async () => {
      await updateBusinessNameChangeService(yar, credentials)

      expect(fetchBusinessChangeService).toHaveBeenCalledWith(yar, credentials, 'changeBusinessName')
    })

    test('it calls updateDalService with correct mutation and variables', async () => {
      await updateBusinessNameChangeService(yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(updateBusinessNameMutation, {
        input: {
          name: 'New business ltd',
          sbi: mappedData.info.sbi
        }
      })
    })

    test('it clears the businessDetails from session', async () => {
      await updateBusinessNameChangeService(yar, credentials)

      expect(yar.clear).toHaveBeenCalledWith('businessDetailsUpdate')
    })

    test('adds a flash notification confirming the change in data', async () => {
      await updateBusinessNameChangeService(yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(yar, 'Success', 'You have updated your business name')
    })
  })
})
