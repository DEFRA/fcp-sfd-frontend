// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Mocks
vi.mock('@defra/fcp-sfd-frontend-engine', () => ({
  utils: { formatValidationErrors: vi.fn() }
}))

vi.mock('../../../../src/services/personal/fetch-personal-change-service.js', () => ({
  fetchPersonalChangeService: vi.fn()
}))

// Test helpers
import { utils } from '@defra/fcp-sfd-frontend-engine'
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'

// Things under test
import { personalEmailChangeErrorService } from '../../../../src/services/personal/personal-email-change-error-service.js'

describe('personalEmailChangeErrorService', () => {
  const yar = {}
  let credentials
  let personalEmail
  let error

  beforeEach(() => {
    vi.clearAllMocks()

    credentials = { crn: '1234567890' }
    personalEmail = 'new-email@test.com'

    fetchPersonalChangeService.mockResolvedValue(mockPersonalDetails())
    utils.formatValidationErrors.mockReturnValue({ personalEmail: { text: 'An error occurred' } })
  })

  describe('when called with an error', () => {
    beforeEach(() => {
      error = [{ path: ['personalEmail'], message: 'An error occurred' }]
    })

    test('it formats the errors', async () => {
      await personalEmailChangeErrorService(yar, credentials, personalEmail, error)

      expect(utils.formatValidationErrors).toHaveBeenCalledWith(error)
    })

    test('it fetches personal details including changePersonalEmail', async () => {
      await personalEmailChangeErrorService(yar, credentials, personalEmail, error)

      expect(fetchPersonalChangeService).toHaveBeenCalledWith(
        yar,
        credentials,
        'changePersonalEmail'
      )
    })

    test('it returns the page data with the entered email and the errors', async () => {
      const result = await personalEmailChangeErrorService(yar, credentials, personalEmail, error)

      expect(result).toEqual({
        backLink: { href: '/personal-details' },
        pageTitle: 'What is your personal email address?',
        metaDescription: 'Update the email address for your personal account.',
        userName: 'Test Name',
        personalEmail: 'new-email@test.com',
        errors: {
          personalEmail: { text: 'An error occurred' }
        }
      })
    })
  })

  describe('when called without an error', () => {
    test('it defaults errors to an empty array', async () => {
      await personalEmailChangeErrorService(yar, credentials, personalEmail)

      expect(utils.formatValidationErrors).toHaveBeenCalledWith([])
    })
  })
})

const mockPersonalDetails = () => {
  return {
    userName: 'Test Name',
    email: 'current-email@test.com'
  }
}
