// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Engine dependencies
import { mutations } from '@defra/fcp-sfd-frontend-engine'

// Mocks
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'
import { updateDalService } from '../../../../src/services/DAL/update-dal-service.js'

// Test helpers
import { getMappedData } from '../../../mocks/mock-business-details.js'

// Thing under test
import { updateBusinessCompanyRegistrationNumberChangeService } from '../../../../src/services/business/update-business-company-registration-number-change-service.js'

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

describe('updateBusinessCompanyRegistrationNumberChangeService', () => {
  let yar
  let credentials
  let data

  beforeEach(() => {
    vi.clearAllMocks()

    data = getMappedData()
    data.changeBusinessCompanyRegistrationNumber = '12345678'
    fetchBusinessChangeService.mockReturnValue(data)

    yar = {
      clear: vi.fn()
    }

    credentials = { sbi: '800000001', crn: '9000000001', sessionId: 'test-session-id' }
  })

  describe('when called', () => {
    test('it fetches the business details with credentials', async () => {
      await updateBusinessCompanyRegistrationNumberChangeService(yar, credentials)

      expect(fetchBusinessChangeService).toHaveBeenCalledWith(yar, credentials, 'changeBusinessCompanyRegistrationNumber')
    })

    test('it calls updateDalService with correct mutation and variables, clearing the charity number', async () => {
      await updateBusinessCompanyRegistrationNumberChangeService(yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(mutations.updateBusinessRegistrationNumbers, {
        input: {
          sbi: data.sbi,
          registrationNumbers: {
            companiesHouse: '12345678',
            charityCommission: null
          }
        }
      }, credentials.sessionId)
    })

    test('it clears the businessDetails from session', async () => {
      await updateBusinessCompanyRegistrationNumberChangeService(yar, credentials)

      expect(yar.clear).toHaveBeenCalledWith('businessDetailsUpdate')
    })

    test('adds a flash notification confirming the change in data', async () => {
      await updateBusinessCompanyRegistrationNumberChangeService(yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(yar, 'Success', 'You have updated your company registration number')
    })
  })

  describe('when there is no changeBusinessCompanyRegistrationNumber in session data', () => {
    beforeEach(() => {
      data.changeBusinessCompanyRegistrationNumber = undefined
    })

    test('it returns early and does not call updateDalService', async () => {
      await updateBusinessCompanyRegistrationNumberChangeService(yar, credentials)

      expect(updateDalService).not.toHaveBeenCalled()
    })

    test('it does not add a flash notification', async () => {
      await updateBusinessCompanyRegistrationNumberChangeService(yar, credentials)

      expect(flashNotification).not.toHaveBeenCalled()
    })

    test('it does not clear businessDetailsUpdate from session', async () => {
      await updateBusinessCompanyRegistrationNumberChangeService(yar, credentials)

      expect(yar.clear).not.toHaveBeenCalled()
    })
  })
})
