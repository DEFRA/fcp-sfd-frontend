// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Thing under test
import { checkInterruptedJourneySessionService } from '../../../src/services/check-interrupter-journey-session-service.js'

describe('checkInterruptedJourneySessionService', () => {
  let yar
  const journeyKey = 'fixJourney'

  beforeEach(() => {
    yar = {
      get: vi.fn()
    }
  })

  describe('when session data is invalid', () => {
    describe('because the session data is missing', () => {
      beforeEach(() => {
        yar.get.mockReturnValue(undefined)
      })

      test('returns false', () => {
        const result = checkInterruptedJourneySessionService(yar, journeyKey)

        expect(result).toBe(false)
        expect(yar.get).toHaveBeenCalledWith(journeyKey)
      })
    })

    describe('because the session data is in an unexpected format', () => {
      beforeEach(() => {
        yar.get.mockReturnValue({ orderedSectionsToFix: 'not-an-array' })
      })

      test('returns false', () => {
        const result = checkInterruptedJourneySessionService(yar, journeyKey)

        expect(result).toBe(false)
        expect(yar.get).toHaveBeenCalledWith(journeyKey)
      })
    })
  })

  describe('when session data is valid', () => {
    beforeEach(() => {
      yar.get.mockReturnValue({
        orderedSectionsToFix: ['name', 'email']
      })
    })

    test('returns true', () => {
      const result = checkInterruptedJourneySessionService(yar, journeyKey)

      expect(result).toBe(true)
      expect(yar.get).toHaveBeenCalledWith(journeyKey)
    })
  })
})
