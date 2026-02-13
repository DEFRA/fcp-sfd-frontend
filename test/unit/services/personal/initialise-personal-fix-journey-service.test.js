// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { initialiseFixJourneyService } from '../../../../src/services/initialise-fix-journey-service.js'

describe('initialiseFixJourneyService', () => {
  let yar
  let sessionData

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('when journeyType is personal', () => {
    beforeEach(() => {
      sessionData = {
        sectionsNeedingUpdate: ['email', 'name', 'phone'],
        personalFixUpdates: {
          name: {
            first: 'John',
            last: 'Doe'
          }
        }
      }

      yar = {
        get: vi.fn().mockReturnValue(sessionData),
        set: vi.fn()
      }
    })

    test('orders sections according to display order', () => {
      const result = initialiseFixJourneyService(yar, undefined, 'personal')

      expect(result.orderedSectionsToFix).toEqual(['name', 'phone', 'email'])
    })

    test('moves source section to the top when provided', () => {
      const result = initialiseFixJourneyService(yar, 'email', 'personal')

      expect(result.orderedSectionsToFix).toEqual(['email', 'name', 'phone'])
    })

    test('does not duplicate the source section', () => {
      const result = initialiseFixJourneyService(yar, 'phone', 'personal')

      expect(result.orderedSectionsToFix).toEqual(['phone', 'name', 'email'])
    })

    test('removes sectionsNeedingUpdate from session data', () => {
      initialiseFixJourneyService(yar, undefined, 'personal')

      expect(sessionData.sectionsNeedingUpdate).toBeUndefined()
    })

    test('removes personalFixUpdates from session data', () => {
      initialiseFixJourneyService(yar, undefined, 'personal')

      expect(sessionData.personalFixUpdates).toBeUndefined()
    })

    test('stores the source when provided', () => {
      const result = initialiseFixJourneyService(yar, 'address', 'personal')

      expect(result.source).toBe('address')
    })

    test('does not set source when none is provided', () => {
      const result = initialiseFixJourneyService(yar, undefined, 'personal')

      expect(result.source).toBeUndefined()
    })

    test('updates the session using yar.set', () => {
      const result = initialiseFixJourneyService(yar, 'name', 'personal')

      expect(yar.set).toHaveBeenCalledWith('personalDetailsValidation', result)
    })

    test('returns early if session data is missing or invalid', () => {
      yar.get.mockReturnValue(undefined)

      const result = initialiseFixJourneyService(yar, undefined, 'personal')

      expect(result).toBeUndefined()
      expect(yar.set).not.toHaveBeenCalled()
    })
  })

  describe('when journeyType is business', () => {
    beforeEach(() => {
      sessionData = {
        sectionsNeedingUpdate: ['email', 'name', 'phone', 'address'],
        personalFixUpdates: {
          name: {
            first: 'John',
            last: 'Doe'
          }
        }
      }

      yar = {
        get: vi.fn().mockReturnValue(sessionData),
        set: vi.fn()
      }
    })

    test('orders sections according to display order', () => {
      const result = initialiseFixJourneyService(yar, undefined, 'business')

      expect(result.orderedSectionsToFix).toEqual(['name', 'address', 'phone', 'email'])
    })

    test('moves source section to the top when provided', () => {
      const result = initialiseFixJourneyService(yar, 'vat', 'business')

      expect(result.orderedSectionsToFix).toEqual(['vat', 'name', 'address', 'phone', 'email'])
    })

    test('does not duplicate the source section', () => {
      const result = initialiseFixJourneyService(yar, 'phone', 'business')

      expect(result.orderedSectionsToFix).toEqual(['phone', 'name', 'address', 'email'])
    })

    test('removes sectionsNeedingUpdate from session data', () => {
      initialiseFixJourneyService(yar, undefined, 'business')

      expect(sessionData.sectionsNeedingUpdate).toBeUndefined()
    })

    test('removes businessFixUpdates from session data', () => {
      initialiseFixJourneyService(yar, undefined, 'business')

      expect(sessionData.businessFixUpdates).toBeUndefined()
    })

    test('stores the source when provided', () => {
      const result = initialiseFixJourneyService(yar, 'address', 'business')

      expect(result.source).toBe('address')
    })

    test('does not set source when none is provided', () => {
      const result = initialiseFixJourneyService(yar, undefined, 'business')

      expect(result.source).toBeUndefined()
    })

    test('updates the session using yar.set', () => {
      const result = initialiseFixJourneyService(yar, 'name', 'business')

      expect(yar.set).toHaveBeenCalledWith('businessDetailsValidation', result)
    })

    test('returns early if session data is missing or invalid', () => {
      yar.get.mockReturnValue(undefined)

      const result = initialiseFixJourneyService(yar, undefined, 'business')

      expect(result).toBeUndefined()
      expect(yar.set).not.toHaveBeenCalled()
    })
  })
})
