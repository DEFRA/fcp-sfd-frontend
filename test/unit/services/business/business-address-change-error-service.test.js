// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'
import { formatValidationErrors } from '../../../../src/utils/format-validation-errors.js'

// Thing under test
import { businessAddressChangeErrorService } from '../../../../src/services/business/business-address-change-error-service.js'

// Mocks
vi.mock('../../../../src/services/business/fetch-business-change-service.js', () => ({
  fetchBusinessChangeService: vi.fn()
}))

vi.mock('../../../../src/utils/format-validation-errors.js', () => ({
  formatValidationErrors: vi.fn()
}))

describe('businessAddressChangeErrorService', () => {
  const yar = {}
  let credentials
  let postcode
  let error

  beforeEach(() => {
    vi.clearAllMocks()

    credentials = { sbi: '123456789' }
    postcode = 'AB12 3CD'

    fetchBusinessChangeService.mockResolvedValue(mockBusinessDetails())
    formatValidationErrors.mockReturnValue([{ text: 'An error occurred' }])
  })

  describe('when called with an error', () => {
    beforeEach(() => {
      error = [{ path: 'changeBusinessPostcode', message: 'Invalid postcode' }]
    })

    test('it formats the errors', async () => {
      await businessAddressChangeErrorService(yar, credentials, postcode, error)

      expect(formatValidationErrors).toHaveBeenCalledWith(error)
    })

    test('it fetches business details including changeBusinessPostcode', async () => {
      await businessAddressChangeErrorService(yar, credentials, postcode, error)

      expect(fetchBusinessChangeService).toHaveBeenCalledWith(
        yar,
        credentials,
        'changeBusinessPostcode'
      )
    })

    test('it calls the presenter with business details and postcode', async () => {
      const result = await businessAddressChangeErrorService(yar, credentials, postcode, error)

      expect(result).toEqual({
        backLink: { href: '/business-details' },
        pageTitle: 'What is your business address?',
        metaDescription: 'Update the address for your business.',
        postcode: 'AB12 3CD',
        businessName: 'Test Business',
        sbi: '123456789',
        userName: 'Alfred Waldron',
        errors: [
          { text: 'An error occurred' }
        ]
      })
    })
  })

  describe('when called without an error', () => {
    test('it defaults errors to an empty array', async () => {
      await businessAddressChangeErrorService(yar, credentials, postcode)

      expect(formatValidationErrors).toHaveBeenCalledWith([])
    })
  })
})

const mockBusinessDetails = () => {
  return {
    address: {
      postcode: 'AB12 3CD'
    },
    info: {
      businessName: 'Test Business',
      sbi: '123456789'
    },
    customer: {
      userName: 'Alfred Waldron'
    },
    changeBusinessPostcode: {
      postcode: 'AB12 3CD'
    }
  }
}
