// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Thing under test
import { checkInterruptedJourneyPreHandler } from '../../../src/routes/check-interrupter-journey-pre-handler-route.js'

describe('checkInterruptedJourneyPreHandler', () => {
  let request
  let h
  let redirectStub

  const journeyKey = 'fixJourney'
  const redirectPath = '/start-page'

  beforeEach(() => {
    redirectStub = {
      takeover: vi.fn().mockReturnThis()
    }

    h = {
      redirect: vi.fn(() => redirectStub)
    }

    request = {
      yar: {
        get: vi.fn()
      }
    }
  })

  describe('when the session is invalid', () => {
    beforeEach(() => {
      request.yar.get.mockReturnValue(undefined)
    })

    test('redirects and takes over', () => {
      const preHandler = checkInterruptedJourneyPreHandler(journeyKey, redirectPath)
      const result = preHandler.method(request, h)

      expect(h.redirect).toHaveBeenCalledWith(redirectPath)
      expect(redirectStub.takeover).toHaveBeenCalled()
      expect(result).toBe(redirectStub)
    })
  })

  describe('when the session is valid', () => {
    beforeEach(() => {
      request.yar.get.mockReturnValue({
        orderedSectionsToFix: ['section1', 'section2']
      })
    })

    test('returns true', () => {
      const preHandler = checkInterruptedJourneyPreHandler(journeyKey, redirectPath)
      const result = preHandler.method(request, h)

      expect(result).toBe(true)
      expect(h.redirect).not.toHaveBeenCalled()
    })
  })
})
