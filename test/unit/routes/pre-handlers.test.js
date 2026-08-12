// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things under test
import { checkSessionDataGuard } from '../../../src/routes/pre-handlers.js'
import {
  PERSONAL_JOURNEY,
  BUSINESS_JOURNEY
} from '../../../src/constants/journeys.js'

describe('pre-handlers', () => {
  let h
  let takeoverMock

  beforeEach(() => {
    vi.clearAllMocks()

    takeoverMock = vi.fn().mockReturnValue({})
    h = {
      redirect: vi.fn().mockReturnValue({ takeover: takeoverMock })
    }
  })

  describe('checkSessionDataGuard', () => {
    let request

    beforeEach(() => {
      request = {
        yar: {
          get: vi.fn()
        }
      }
    })

    describe('when checking a single field', () => {
      describe('and the field exists in session', () => {
        beforeEach(() => {
          request.yar.get.mockReturnValue({
            changePersonalDob: '1990-01-15'
          })
        })

        test('it should allow the request to continue', async () => {
          const guard = checkSessionDataGuard(PERSONAL_JOURNEY, 'changePersonalDob')
          const result = await guard.method(request, h)

          expect(result).toBe(true)
          expect(h.redirect).not.toHaveBeenCalled()
        })
      })

      describe('and the field is missing from session', () => {
        beforeEach(() => {
          request.yar.get.mockReturnValue({})
        })

        test('it should redirect to the specified path', async () => {
          const guard = checkSessionDataGuard(PERSONAL_JOURNEY, 'changePersonalDob')
          await guard.method(request, h)

          expect(h.redirect).toHaveBeenCalledWith(PERSONAL_JOURNEY.redirectPath)
          expect(takeoverMock).toHaveBeenCalled()
        })
      })

      describe('and session data is not set', () => {
        beforeEach(() => {
          request.yar.get.mockReturnValue(null)
        })

        test('it should redirect to the specified path', async () => {
          const guard = checkSessionDataGuard(PERSONAL_JOURNEY, 'changePersonalDob')
          await guard.method(request, h)

          expect(h.redirect).toHaveBeenCalledWith(PERSONAL_JOURNEY.redirectPath)
          expect(takeoverMock).toHaveBeenCalled()
        })
      })

      describe('and the field has a falsy value (but is present)', () => {
        test('it should allow the request to continue when value is false', async () => {
          request.yar.get.mockReturnValue({
            changePersonalChoice: false
          })
          const journey = { sessionKey: 'personalDetailsUpdate', redirectPath: '/personal-details' }
          const guard = checkSessionDataGuard(journey, 'changePersonalChoice')
          const result = await guard.method(request, h)

          expect(result).toBe(true)
          expect(h.redirect).not.toHaveBeenCalled()
        })

        test('it should allow the request to continue when value is 0', async () => {
          request.yar.get.mockReturnValue({
            changePersonalNumber: 0
          })
          const journey = { sessionKey: 'personalDetailsUpdate', redirectPath: '/personal-details' }
          const guard = checkSessionDataGuard(journey, 'changePersonalNumber')
          const result = await guard.method(request, h)

          expect(result).toBe(true)
          expect(h.redirect).not.toHaveBeenCalled()
        })

        test('it should allow the request to continue when value is empty string', async () => {
          request.yar.get.mockReturnValue({
            changePersonalText: ''
          })
          const journey = { sessionKey: 'personalDetailsUpdate', redirectPath: '/personal-details' }
          const guard = checkSessionDataGuard(journey, 'changePersonalText')
          const result = await guard.method(request, h)

          expect(result).toBe(true)
          expect(h.redirect).not.toHaveBeenCalled()
        })
      })
    })

    describe('when checking multiple fields', () => {
      describe('and all fields exist in session', () => {
        beforeEach(() => {
          request.yar.get.mockReturnValue({
            changeBusinessPostcode: { postcode: 'SW1A 1AA' },
            changeBusinessAddresses: [{ address: '10 Downing Street' }]
          })
        })

        test('it should allow the request to continue', async () => {
          const guard = checkSessionDataGuard(
            BUSINESS_JOURNEY,
            ['changeBusinessPostcode', 'changeBusinessAddresses']
          )
          const result = await guard.method(request, h)

          expect(result).toBe(true)
          expect(h.redirect).not.toHaveBeenCalled()
        })
      })

      describe('and some fields are missing from session', () => {
        beforeEach(() => {
          request.yar.get.mockReturnValue({
            changeBusinessPostcode: { postcode: 'SW1A 1AA' }
            // changeBusinessAddresses is missing
          })
        })

        test('it should redirect to the specified path', async () => {
          const guard = checkSessionDataGuard(
            BUSINESS_JOURNEY,
            ['changeBusinessPostcode', 'changeBusinessAddresses']
          )
          await guard.method(request, h)

          expect(h.redirect).toHaveBeenCalledWith(BUSINESS_JOURNEY.redirectPath)
          expect(takeoverMock).toHaveBeenCalled()
        })
      })

      describe('and all fields are missing from session', () => {
        beforeEach(() => {
          request.yar.get.mockReturnValue({})
        })

        test('it should redirect to the specified path', async () => {
          const guard = checkSessionDataGuard(
            BUSINESS_JOURNEY,
            ['changeBusinessPostcode', 'changeBusinessAddresses']
          )
          await guard.method(request, h)

          expect(h.redirect).toHaveBeenCalledWith(BUSINESS_JOURNEY.redirectPath)
          expect(takeoverMock).toHaveBeenCalled()
        })
      })
    })

    describe('when session key does not match', () => {
      beforeEach(() => {
        request.yar.get.mockReturnValue(null)
      })

      test('it should look up the correct session key', async () => {
        const guard = checkSessionDataGuard(PERSONAL_JOURNEY, 'changePersonalDob')
        await guard.method(request, h)

        expect(request.yar.get).toHaveBeenCalledWith(PERSONAL_JOURNEY.sessionKey)
      })

      test('it should redirect if the correct session key has no data', async () => {
        const guard = checkSessionDataGuard(BUSINESS_JOURNEY, 'changeBusinessAddress')
        await guard.method(request, h)

        expect(h.redirect).toHaveBeenCalledWith(BUSINESS_JOURNEY.redirectPath)
      })
    })

    describe('redirect behavior', () => {
      beforeEach(() => {
        request.yar.get.mockReturnValue({})
      })

      test('it should call redirect with the correct path', async () => {
        const customJourney = { sessionKey: 'personalDetailsUpdate', redirectPath: '/account-details' }
        const guard = checkSessionDataGuard(customJourney, 'changePersonalPhone')
        await guard.method(request, h)

        expect(h.redirect).toHaveBeenCalledWith(customJourney.redirectPath)
      })

      test('it should call takeover on the redirect response', async () => {
        const guard = checkSessionDataGuard(BUSINESS_JOURNEY, 'changeBusinessAddress')
        await guard.method(request, h)

        expect(takeoverMock).toHaveBeenCalled()
      })
    })
  })
})
