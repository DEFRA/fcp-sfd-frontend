// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'
import { formatValidationErrors } from '../../../../src/utils/format-validation-errors.js'

// Thing under test
import { personalAddressChangeErrorService } from '../../../../src/services/personal/personal-address-change-error-service.js'

// Mocks
vi.mock('../../../../src/services/personal/fetch-personal-change-service', () => ({
  fetchPersonalChangeService: vi.fn()
}))

vi.mock('../../../../src/utils/format-validation-errors', () => ({
  formatValidationErrors: vi.fn()
}))

describe('personalAddressChangeErrorService', () => {
  const yar = {}
  let credentials
  let postcode
  let error

  beforeEach(() => {
    vi.clearAllMocks()

    credentials = { sbi: '123456789' }
    postcode = 'AB12 3CD'

    fetchPersonalChangeService.mockResolvedValue(mockPersonalDetails())
    formatValidationErrors.mockReturnValue([{ text: 'An error occurred' }])
  })

  describe('when called with an error', () => {
    beforeEach(() => {
      error = [{ path: 'changePersonalPostcode', message: 'Invalid postcode' }]
    })

    test('it formats the errors', async () => {
      await personalAddressChangeErrorService(yar, credentials, postcode, error)

      expect(formatValidationErrors).toHaveBeenCalledWith(error)
    })

    test('it fetches personal details including changePersonalPostcode', async () => {
      await personalAddressChangeErrorService(yar, credentials, postcode, error)

      expect(fetchPersonalChangeService).toHaveBeenCalledWith(
        yar,
        credentials,
        'changePersonalPostcode'
      )
    })

    test('it calls the presenter with personal details and postcode', async () => {
      const result = await personalAddressChangeErrorService(yar, credentials, postcode, error)

      expect(result).toEqual({
        backLink: { href: '/personal-details' },
        pageTitle: 'What is your personal address?',
        metaDescription: 'Update the address for your personal account.',
        postcode: 'AB12 3CD',
        userName: 'Test Name',
        errors: [
          { text: 'An error occurred' }
        ]
      })
    })
  })

  describe('when called without an error', () => {
    test('it defaults errors to an empty array', async () => {
      await personalAddressChangeErrorService(yar, credentials, postcode)

      expect(formatValidationErrors).toHaveBeenCalledWith([])
    })
  })
})

const mockPersonalDetails = () => {
  return {
    address: {
      postcode: 'AB12 3CD'
    },
    info: {
      fullName: {
        first: 'Test',
        last: 'Name'
      }
    },
    changePersonalPostcode: {
      postcode: 'AB12 3CD'
    }
  }
}
