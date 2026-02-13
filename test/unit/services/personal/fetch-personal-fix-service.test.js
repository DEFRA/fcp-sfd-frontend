// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchPersonalDetailsService } from '../../../../src/services/personal/fetch-personal-details-service.js'

// Thing under test
import { fetchPersonalFixService } from '../../../../src/services/personal/fetch-personal-fix-service.js'

// Test helpers
import { mappedData } from '../../../mocks/mock-personal-details.js'

// Mocks
vi.mock('../../../../src/services/personal/fetch-personal-details-service.js', () => ({
  fetchPersonalDetailsService: vi.fn()
}))

describe('fetchPersonalFixService', () => {
  let credentials
  let sessionData
  const personalDetails = { ...mappedData }

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

    fetchPersonalDetailsService.mockResolvedValue(personalDetails)
  })

  describe('when there are no personalFixUpdates in session', () => {
    test('it returns personal details with source and orderedSectionsToFix', async () => {
      const result = await fetchPersonalFixService(credentials, sessionData)

      expect(fetchPersonalDetailsService).toHaveBeenCalledWith(credentials)
      expect(result).toEqual({
        source: 'address',
        orderedSectionsToFix: ['name', 'address'],
        ...personalDetails
      })
    })
  })

  describe('when name fixes exist in session', () => {
    beforeEach(() => {
      sessionData.personalFixUpdates = {
        name: {
          first: 'John',
          last: 'Doe'
        }
      }
    })

    test('it overlays the name fix onto personal details', async () => {
      const result = await fetchPersonalFixService(credentials, sessionData)

      expect(result.changePersonalName).toEqual({
        first: 'John',
        last: 'Doe'
      })
    })
  })

  describe('when dob fixes exist in session', () => {
    beforeEach(() => {
      sessionData.personalFixUpdates = {
        dob: {
          day: '12',
          month: '12',
          year: '1990'
        }
      }
    })

    test('it overlays the dob fix onto personal details', async () => {
      const result = await fetchPersonalFixService(credentials, sessionData)

      expect(result.changePersonalDob).toEqual({
        day: '12',
        month: '12',
        year: '1990'
      })
    })
  })

  describe('when email fixes exist in session', () => {
    beforeEach(() => {
      sessionData.personalFixUpdates = {
        email: {
          personalEmail: 'new@email.com'
        }
      }
    })

    test('it overlays the email fix onto personal details', async () => {
      const result = await fetchPersonalFixService(credentials, sessionData)

      expect(result.changePersonalEmail).toEqual({
        personalEmail: 'new@email.com'
      })
    })
  })

  describe('when phone fixes exist in session', () => {
    beforeEach(() => {
      sessionData.personalFixUpdates = {
        phone: {
          personalTelephone: '0123456789',
          personalMobile: '07123456789'
        }
      }
    })

    test('it overlays the phone fix onto personal details', async () => {
      const result = await fetchPersonalFixService(credentials, sessionData)

      expect(result.changePersonalPhoneNumbers).toEqual({
        personalTelephone: '0123456789',
        personalMobile: '07123456789'
      })
    })
  })

  describe('when address fixes exist in session', () => {
    beforeEach(() => {
      sessionData.personalFixUpdates = {
        address: {
          address1: '123 Main St',
          postcode: 'A1 2BC'
        }
      }
    })

    test('it overlays the address fix onto personal details', async () => {
      const result = await fetchPersonalFixService(credentials, sessionData)

      expect(result.changePersonalAddress).toEqual({
        address1: '123 Main St',
        postcode: 'A1 2BC'
      })
    })
  })

  describe('when multiple fixes exist in session', () => {
    beforeEach(() => {
      sessionData.personalFixUpdates = {
        name: { first: 'Jane', last: 'Smith' },
        email: { personalEmail: 'jane@smith.com' },
        phone: { personalMobile: '07123456789' }
      }
    })

    test('it overlays all fixes onto personal details', async () => {
      const result = await fetchPersonalFixService(credentials, sessionData)

      expect(result).toMatchObject({
        changePersonalName: { first: 'Jane', last: 'Smith' },
        changePersonalEmail: { personalEmail: 'jane@smith.com' },
        changePersonalPhoneNumbers: { personalMobile: '07123456789' }
      })
    })
  })
})
