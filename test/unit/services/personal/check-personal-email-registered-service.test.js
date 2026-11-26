// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Mocks
const mockDalConnector = { query: vi.fn() }

vi.mock('../../../../src/dal/connector.js', () => ({
  getDalConnector: vi.fn(() => mockDalConnector)
}))

vi.mock('../../../../src/services/personal/fetch-personal-details-service.js', () => ({
  fetchPersonalDetailsService: vi.fn()
}))

// Test helpers
import { constants, queries } from '@defra/fcp-sfd-frontend-engine'
import { fetchPersonalDetailsService } from '../../../../src/services/personal/fetch-personal-details-service.js'

// Things under test
import { checkPersonalEmailRegisteredService } from '../../../../src/services/personal/check-personal-email-registered-service.js'

describe('checkPersonalEmailRegisteredService', () => {
  let credentials

  beforeEach(() => {
    vi.clearAllMocks()

    credentials = {
      crn: '9123456789',
      sbi: '812345678',
      sessionId: 'test-session-id'
    }

    fetchPersonalDetailsService.mockResolvedValue({ email: 'current-email@test.com' })
  })

  describe('when the email is unchanged', () => {
    test('it does not check the DAL', async () => {
      await checkPersonalEmailRegisteredService('current-email@test.com', credentials)

      expect(mockDalConnector.query).not.toHaveBeenCalled()
    })

    test('it returns no error', async () => {
      const result = await checkPersonalEmailRegisteredService('current-email@test.com', credentials)

      expect(result).toEqual({})
    })
  })

  describe('when the email is unchanged but in a different case', () => {
    test('it does not check the DAL', async () => {
      await checkPersonalEmailRegisteredService('Current-Email@Test.com', credentials)

      expect(mockDalConnector.query).not.toHaveBeenCalled()
    })
  })

  describe('when the customer has no current email', () => {
    beforeEach(() => {
      fetchPersonalDetailsService.mockResolvedValue({ email: null })
      mockDalConnector.query.mockResolvedValue({ data: { isCustomerEmailRegistered: false } })
    })

    test('it checks the DAL', async () => {
      await checkPersonalEmailRegisteredService('new-email@test.com', credentials)

      expect(mockDalConnector.query).toHaveBeenCalled()
    })
  })

  describe('when the email has changed', () => {
    describe('and the email is not already registered', () => {
      beforeEach(() => {
        mockDalConnector.query.mockResolvedValue({ data: { isCustomerEmailRegistered: false } })
      })

      test('it fetches the personal details with the credentials', async () => {
        await checkPersonalEmailRegisteredService('new-email@test.com', credentials)

        expect(fetchPersonalDetailsService).toHaveBeenCalledWith(credentials)
      })

      test('it checks the DAL with the new email and session id', async () => {
        await checkPersonalEmailRegisteredService('new-email@test.com', credentials)

        expect(mockDalConnector.query).toHaveBeenCalledWith(
          queries.isCustomerEmailRegistered,
          { email: 'new-email@test.com' },
          { sessionId: 'test-session-id' }
        )
      })

      test('it returns no error', async () => {
        const result = await checkPersonalEmailRegisteredService('new-email@test.com', credentials)

        expect(result).toEqual({})
      })
    })

    describe('and the email is already registered', () => {
      beforeEach(() => {
        mockDalConnector.query.mockResolvedValue({ data: { isCustomerEmailRegistered: true } })
      })

      test('it returns a personalEmail error', async () => {
        const result = await checkPersonalEmailRegisteredService('new-email@test.com', credentials)

        expect(result).toEqual({
          error: [
            {
              message: constants.errorMessages.PERSONAL_EMAIL_ALREADY_REGISTERED,
              path: ['personalEmail']
            }
          ]
        })
      })
    })

    describe('and the DAL returns no data', () => {
      beforeEach(() => {
        mockDalConnector.query.mockResolvedValue({ data: null, errors: [{ message: 'DAL error' }] })
      })

      test('it throws an error', async () => {
        await expect(checkPersonalEmailRegisteredService('new-email@test.com', credentials))
          .rejects.toThrow('Failed to check personal email address')
      })
    })
  })
})
