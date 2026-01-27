// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { initialisePersonalFixJourneyService } from '../../../../src/services/personal/initialise-personal-fix-journey-service.js'

describe('initialisePersonalFixJourneyService', () => {
  let yar
  let sessionData

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
    const result = initialisePersonalFixJourneyService(yar)

    expect(result.orderedSectionsToFix).toEqual(['name', 'phone', 'email'])
  })

  test('moves source section to the top when provided', () => {
    const result = initialisePersonalFixJourneyService(yar, 'email')

    expect(result.orderedSectionsToFix).toEqual(['email', 'name', 'phone'])
  })

  test('does not duplicate the source section', () => {
    const result = initialisePersonalFixJourneyService(yar, 'phone')

    expect(result.orderedSectionsToFix).toEqual(['phone', 'name', 'email'])
  })

  test('removes sectionsNeedingUpdate from session data', () => {
    initialisePersonalFixJourneyService(yar)

    expect(sessionData.sectionsNeedingUpdate).toBeUndefined()
  })

  test('removes personalFixUpdates from session data', () => {
    initialisePersonalFixJourneyService(yar)

    expect(sessionData.personalFixUpdates).toBeUndefined()
  })

  test('stores the source when provided', () => {
    const result = initialisePersonalFixJourneyService(yar, 'address')

    expect(result.source).toBe('address')
  })

  test('does not set source when none is provided', () => {
    const result = initialisePersonalFixJourneyService(yar)

    expect(result.source).toBeUndefined()
  })

  test('updates the session using yar.set', () => {
    const result = initialisePersonalFixJourneyService(yar, 'name')

    expect(yar.set).toHaveBeenCalledWith('personalDetailsValidation', result)
  })

  test('returns early if session data is missing or invalid', () => {
    yar.get.mockReturnValue(undefined)

    const result = initialisePersonalFixJourneyService(yar)

    expect(result).toBeUndefined()
    expect(yar.set).not.toHaveBeenCalled()
  })
})
