// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'

// Thing under test
import { fetchBusinessFixService } from '../../../../src/services/business/fetch-business-fix-service.js'

// Test helpers
import { mappedData } from '../../../mocks/mock-business-details.js'

// Mocks
vi.mock('../../../../src/services/business/fetch-business-details-service.js', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

describe('fetchBusinessFixService', () => {
  let credentials
  let sessionData
  const businessDetails = { ...mappedData }

  beforeEach(() => {
    vi.clearAllMocks()

    credentials = {
      crn: '987654321',
      email: 'test@example.com'
    }

    sessionData = {
      source: 'address',
      orderedSectionsToFix: ['name', 'address']
    }

    fetchBusinessDetailsService.mockResolvedValue(businessDetails)
  })

  describe('when there are no businessFixUpdates in session', () => {
    test('it returns business details with source and orderedSectionsToFix', async () => {
      const result = await fetchBusinessFixService(credentials, sessionData)

      expect(fetchBusinessDetailsService).toHaveBeenCalledWith(credentials)
      expect(result).toEqual({
        source: 'address',
        orderedSectionsToFix: ['name', 'address'],
        ...businessDetails
      })
    })
  })

  describe('when name fixes exist in session', () => {
    beforeEach(() => {
      sessionData.businessFixUpdates = {
        name: { businessName: 'New Business Name Ltd' }
      }
    })

    test('it overlays the name fix onto business details', async () => {
      const result = await fetchBusinessFixService(credentials, sessionData)

      expect(result.changeBusinessName).toEqual({ businessName: 'New Business Name Ltd' })
    })
  })

  describe('when vat fixes exist in session', () => {
    beforeEach(() => {
      sessionData.businessFixUpdates = {
        vat: { vatNumber: '123456789'}
      }
    })

    test('it overlays the vat fix onto business details', async () => {
      const result = await fetchBusinessFixService(credentials, sessionData)

      expect(result.changeBusinessVat).toEqual({ vatNumber: '123456789' })
    })
  })

  describe('when email fixes exist in session', () => {
    beforeEach(() => {
      sessionData.businessFixUpdates = {
        email: {
          businessEmail: 'new@email.com'
        }
      }
    })

    test('it overlays the email fix onto business details', async () => {
      const result = await fetchBusinessFixService(credentials, sessionData)

      expect(result.changeBusinessEmail).toEqual({ businessEmail: 'new@email.com' })
    })
  })

  describe('when phone fixes exist in session', () => {
    beforeEach(() => {
      sessionData.businessFixUpdates = {
        phone: {
          businessTelephone: '0123456789',
          businessMobile: '07123456789'
        }
      }
    })

    test('it overlays the phone fix onto business details', async () => {
      const result = await fetchBusinessFixService(credentials, sessionData)

      expect(result.changeBusinessPhoneNumbers).toEqual({
        businessTelephone: '0123456789',
        businessMobile: '07123456789'
      })
    })
  })

  describe('when address fixes exist in session', () => {
    beforeEach(() => {
      sessionData.businessFixUpdates = {
        address: {
          address1: '123 Main St',
          postcode: 'A1 2BC'
        }
      }
    })

    test('it overlays the address fix onto business details', async () => {
      const result = await fetchBusinessFixService(credentials, sessionData)

      expect(result.changeBusinessAddress).toEqual({
        address1: '123 Main St',
        postcode: 'A1 2BC'
      })
    })
  })

  describe('when multiple fixes exist in session', () => {
    beforeEach(() => {
      sessionData.businessFixUpdates = {
        name: { businessName: 'New business name' },
        email: { businessEmail: 'jane@smith.com' },
        phone: { businessMobile: '07123456789' }
      }
    })

    test('it overlays all fixes onto business details', async () => {
      const result = await fetchBusinessFixService(credentials, sessionData)

      expect(result).toMatchObject({
        changeBusinessName: { businessName: 'New business name' },
        changeBusinessEmail: { businessEmail: 'jane@smith.com' },
        changeBusinessPhoneNumbers: { businessMobile: '07123456789' }
      })
    })
  })
})
