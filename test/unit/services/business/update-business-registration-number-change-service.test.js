// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Engine dependencies
import { constants, mutations } from '@defra/fcp-sfd-frontend-engine'

// Mocks
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'
import { updateDalService } from '../../../../src/services/DAL/update-dal-service.js'

// Thing under test
import { updateBusinessRegistrationNumberChangeService } from '../../../../src/services/business/update-business-registration-number-change-service.js'

vi.mock('../../../../src/services/business/fetch-business-change-service.js', () => ({
  fetchBusinessChangeService: vi.fn()
}))

vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

vi.mock('../../../../src/services/DAL/update-dal-service.js', () => ({
  updateDalService: vi.fn().mockResolvedValue({})
}))

describe('updateBusinessRegistrationNumberChangeService', () => {
  let yar
  let credentials

  beforeEach(() => {
    vi.clearAllMocks()

    yar = {
      clear: vi.fn()
    }

    credentials = { sbi: '800000002', crn: '9000000001', sessionId: 'test-session-id' }
  })

  test('fetches the pending registration number from session', async () => {
    fetchBusinessChangeService.mockResolvedValue(getCompanyData())

    await updateBusinessRegistrationNumberChangeService(yar, credentials)

    expect(fetchBusinessChangeService).toHaveBeenCalledWith(yar, credentials, [
      'changeBusinessCharityCommissionRegistrationNumber',
      'changeBusinessCompanyRegistrationNumber'
    ])
  })

  describe('when the business is a company', () => {
    beforeEach(() => {
      fetchBusinessChangeService.mockResolvedValue(getCompanyData())
    })

    test('sends the company number and nulls the charity number', async () => {
      await updateBusinessRegistrationNumberChangeService(yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(
        mutations.updateBusinessRegistrationNumbers,
        {
          input: {
            sbi: '800000002',
            registrationNumbers: {
              companiesHouse: '12345678',
              charityCommission: null
            }
          }
        },
        credentials.sessionId
      )
    })

    test('clears the cached business details from session', async () => {
      await updateBusinessRegistrationNumberChangeService(yar, credentials)

      expect(yar.clear).toHaveBeenCalledWith('businessDetailsUpdate')
    })

    test('displays the company registration number success notification', async () => {
      await updateBusinessRegistrationNumberChangeService(yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(yar, 'Success', 'You have updated your company registration number')
    })
  })

  describe('when the business is a charity', () => {
    beforeEach(() => {
      fetchBusinessChangeService.mockResolvedValue(getCharityData())
    })

    test('sends the charity number and nulls the company number', async () => {
      await updateBusinessRegistrationNumberChangeService(yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(
        mutations.updateBusinessRegistrationNumbers,
        {
          input: {
            sbi: '800000002',
            registrationNumbers: {
              companiesHouse: null,
              charityCommission: '7654321'
            }
          }
        },
        credentials.sessionId
      )
    })

    test('displays the charity commission registration number success notification', async () => {
      await updateBusinessRegistrationNumberChangeService(yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(yar, 'Success', 'You have updated your charity commission registration number')
    })
  })

  describe('when there is no pending registration number in session', () => {
    beforeEach(() => {
      fetchBusinessChangeService.mockResolvedValue({ sbi: '800000002', legalStatusCode: 102105 })
    })

    test('returns early without calling the DAL, clearing session or notifying', async () => {
      await updateBusinessRegistrationNumberChangeService(yar, credentials)

      expect(updateDalService).not.toHaveBeenCalled()
      expect(yar.clear).not.toHaveBeenCalled()
      expect(flashNotification).not.toHaveBeenCalled()
    })
  })

  describe('when the DAL update fails', () => {
    beforeEach(() => {
      fetchBusinessChangeService.mockResolvedValue(getCompanyData())
      updateDalService.mockRejectedValueOnce(new Error('DAL unavailable'))
    })

    test('propagates the error without clearing session or notifying', async () => {
      await expect(updateBusinessRegistrationNumberChangeService(yar, credentials)).rejects.toThrow('DAL unavailable')

      expect(yar.clear).not.toHaveBeenCalled()
      expect(flashNotification).not.toHaveBeenCalled()
    })
  })
})

// The DAL returns the legal status code as a number
const getCompanyData = () => ({
  sbi: '800000002',
  legalStatusCode: Number(constants.business.COMPANY_REGISTRATION_LEGAL_STATUS_CODES[0]),
  changeBusinessCompanyRegistrationNumber: '12345678'
})

const getCharityData = () => ({
  sbi: '800000002',
  legalStatusCode: Number(constants.business.CHARITY_REGISTRATION_LEGAL_STATUS_CODES[0]),
  changeBusinessCharityCommissionRegistrationNumber: '7654321'
})
