// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'
import { updateDalService } from '../../../../src/services/DAL/update-dal-service.js'

// Test helpers
import { getMappedData } from '../../../mocks/mock-business-details.js'

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

vi.mock('@defra/fcp-sfd-frontend-engine', () => ({
  mutations: { updateBusinessName: 'update-business-name-mutation' },
  utils: {
    buildUpdateBusinessNameVariables: (name, sbi) => ({ input: { name, sbi } })
  },
  constants: {
    successMessages: { BUSINESS_NAME: 'You have updated your business name' }
  }
}))

// Thing under test
const { updateBusinessNameChangeService } = await import('../../../../src/services/business/update-business-name-change-service.js')

describe('updateBusinessNameChangeService', () => {
  let yar
  let credentials
  let data

  beforeEach(() => {
    vi.clearAllMocks()

    data = getMappedData()
    data.changeBusinessName = 'New business ltd'
    fetchBusinessChangeService.mockReturnValue(data)

    yar = {
      clear: vi.fn()
    }

    credentials = { sbi: '123456789', crn: '987654321', sessionId: 'test-session-id' }
  })

  describe('when called', () => {
    test('it fetches the business details with credentials', async () => {
      await updateBusinessNameChangeService(yar, credentials)

      expect(fetchBusinessChangeService).toHaveBeenCalledWith(yar, credentials, 'changeBusinessName')
    })

    test('it calls updateDalService with correct mutation and variables', async () => {
      await updateBusinessNameChangeService(yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(
        'update-business-name-mutation',
        { input: { name: 'New business ltd', sbi: data.info.sbi } },
        credentials.sessionId
      )
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

  describe('when there is no changeBusinessName in session data', () => {
    beforeEach(() => {
      data.changeBusinessName = undefined
    })

    test('it returns early and does not call updateDalService', async () => {
      await updateBusinessNameChangeService(yar, credentials)

      expect(updateDalService).not.toHaveBeenCalled()
    })

    test('it does not add a flash notification', async () => {
      await updateBusinessNameChangeService(yar, credentials)

      expect(flashNotification).not.toHaveBeenCalled()
    })

    test('it does not clear businessDetailsUpdate from session', async () => {
      await updateBusinessNameChangeService(yar, credentials)

      expect(yar.clear).not.toHaveBeenCalled()
    })
  })
})
