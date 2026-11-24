// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Mocks
vi.mock('@defra/fcp-sfd-frontend-engine', () => ({
  services: {
    checkInterrupterJourneySession: vi.fn()
  }
}))

vi.mock('../../../src/utils/feature-toggle/check-field-accessibility.js', () => ({
  isBusinessFieldAccessible: vi.fn(),
  isPersonalFieldAccessible: vi.fn()
}))

// Test helpers
import { services } from '@defra/fcp-sfd-frontend-engine'
import {
  PERSONAL_JOURNEY,
  BUSINESS_JOURNEY,
  BUSINESS_DETAILS_VALIDATION_JOURNEY
} from '../../../src/constants/journeys.js'
import {
  AMEND_LEVEL_PERMISSION,
  FULL_PERMISSION,
  MAKE_LEGAL_CHANGES_PERMISSION
} from '../../../src/constants/scope/business-details.js'
import { isBusinessFieldAccessible, isPersonalFieldAccessible } from '../../../src/utils/feature-toggle/check-field-accessibility.js'

// Things under test
import {
  checkSessionDataGuard,
  checkInterrupterJourneyPreHandler,
  checkBusinessFieldAccessibleGuard,
  checkPersonalFieldAccessibleGuard,
  checkBusinessFixPermissionsPreHandler
} from '../../../src/routes/pre-handlers.js'

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
          // changeBusinessAddresses is missing
          request.yar.get.mockReturnValue({
            changeBusinessPostcode: { postcode: 'SW1A 1AA' }
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

  describe('checkInterrupterJourneyPreHandler', () => {
    let request
    let h
    let redirectStub

    const journey = {
      journeyKey: 'fixJourney',
      redirectPath: '/start-page'
    }

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
        services.checkInterrupterJourneySession.mockReturnValue(false)
      })

      test('redirects and takes over', () => {
        const preHandler = checkInterrupterJourneyPreHandler(journey)
        const result = preHandler.method(request, h)

        expect(services.checkInterrupterJourneySession).toHaveBeenCalledWith(request.yar, journey.journeyKey)
        expect(h.redirect).toHaveBeenCalledWith(journey.redirectPath)
        expect(redirectStub.takeover).toHaveBeenCalled()
        expect(result).toBe(redirectStub)
      })
    })

    describe('when the session is valid', () => {
      beforeEach(() => {
        services.checkInterrupterJourneySession.mockReturnValue(true)
      })

      test('returns true', () => {
        const preHandler = checkInterrupterJourneyPreHandler(journey)
        const result = preHandler.method(request, h)

        expect(services.checkInterrupterJourneySession).toHaveBeenCalledWith(request.yar, journey.journeyKey)
        expect(result).toBe(true)
        expect(h.redirect).not.toHaveBeenCalled()
      })
    })
  })

  describe('checkBusinessFieldAccessibleGuard', () => {
    let request

    beforeEach(() => {
      vi.clearAllMocks()
      request = {}
    })

    describe('when the business field is accessible', () => {
      beforeEach(() => {
        isBusinessFieldAccessible.mockReturnValue(true)
      })

      test('it allows the request to continue for name field', () => {
        const guard = checkBusinessFieldAccessibleGuard('name')
        const result = guard.method(request, h)

        expect(isBusinessFieldAccessible).toHaveBeenCalledWith('name')
        expect(result).toBe(true)
        expect(h.redirect).not.toHaveBeenCalled()
      })

      test('it allows the request to continue for address field', () => {
        const guard = checkBusinessFieldAccessibleGuard('address')
        const result = guard.method(request, h)

        expect(isBusinessFieldAccessible).toHaveBeenCalledWith('address')
        expect(result).toBe(true)
        expect(h.redirect).not.toHaveBeenCalled()
      })

      test('it allows the request to continue for phone field', () => {
        const guard = checkBusinessFieldAccessibleGuard('phone')
        const result = guard.method(request, h)

        expect(isBusinessFieldAccessible).toHaveBeenCalledWith('phone')
        expect(result).toBe(true)
        expect(h.redirect).not.toHaveBeenCalled()
      })

      test('it allows the request to continue for email field', () => {
        const guard = checkBusinessFieldAccessibleGuard('email')
        const result = guard.method(request, h)

        expect(isBusinessFieldAccessible).toHaveBeenCalledWith('email')
        expect(result).toBe(true)
        expect(h.redirect).not.toHaveBeenCalled()
      })

      test('it allows the request to continue for vat field', () => {
        const guard = checkBusinessFieldAccessibleGuard('vat')
        const result = guard.method(request, h)

        expect(isBusinessFieldAccessible).toHaveBeenCalledWith('vat')
        expect(result).toBe(true)
        expect(h.redirect).not.toHaveBeenCalled()
      })

      test('it allows the request to continue for registrationNumber field', () => {
        const guard = checkBusinessFieldAccessibleGuard('registrationNumber')
        const result = guard.method(request, h)

        expect(isBusinessFieldAccessible).toHaveBeenCalledWith('registrationNumber')
        expect(result).toBe(true)
        expect(h.redirect).not.toHaveBeenCalled()
      })
    })

    describe('when the business field is not accessible', () => {
      beforeEach(() => {
        isBusinessFieldAccessible.mockReturnValue(false)
        takeoverMock = vi.fn().mockReturnValue({})
        h.redirect = vi.fn().mockReturnValue({ takeover: takeoverMock })
      })

      test('it redirects to the business details page for name field', () => {
        const guard = checkBusinessFieldAccessibleGuard('name')
        guard.method(request, h)

        expect(isBusinessFieldAccessible).toHaveBeenCalledWith('name')
        expect(h.redirect).toHaveBeenCalledWith('/business-details')
        expect(takeoverMock).toHaveBeenCalled()
      })

      test('it redirects to the business details page for address field', () => {
        const guard = checkBusinessFieldAccessibleGuard('address')
        guard.method(request, h)

        expect(isBusinessFieldAccessible).toHaveBeenCalledWith('address')
        expect(h.redirect).toHaveBeenCalledWith('/business-details')
        expect(takeoverMock).toHaveBeenCalled()
      })

      test('it redirects to the business details page for phone field', () => {
        const guard = checkBusinessFieldAccessibleGuard('phone')
        guard.method(request, h)

        expect(isBusinessFieldAccessible).toHaveBeenCalledWith('phone')
        expect(h.redirect).toHaveBeenCalledWith('/business-details')
        expect(takeoverMock).toHaveBeenCalled()
      })

      test('it redirects to the business details page for email field', () => {
        const guard = checkBusinessFieldAccessibleGuard('email')
        guard.method(request, h)

        expect(isBusinessFieldAccessible).toHaveBeenCalledWith('email')
        expect(h.redirect).toHaveBeenCalledWith('/business-details')
        expect(takeoverMock).toHaveBeenCalled()
      })

      test('it redirects to the business details page for vat field', () => {
        const guard = checkBusinessFieldAccessibleGuard('vat')
        guard.method(request, h)

        expect(isBusinessFieldAccessible).toHaveBeenCalledWith('vat')
        expect(h.redirect).toHaveBeenCalledWith('/business-details')
        expect(takeoverMock).toHaveBeenCalled()
      })

      test('it redirects to the business details page for registrationNumber field', () => {
        const guard = checkBusinessFieldAccessibleGuard('registrationNumber')
        guard.method(request, h)

        expect(isBusinessFieldAccessible).toHaveBeenCalledWith('registrationNumber')
        expect(h.redirect).toHaveBeenCalledWith('/business-details')
        expect(takeoverMock).toHaveBeenCalled()
      })
    })
  })

  describe('checkPersonalFieldAccessibleGuard', () => {
    let request

    beforeEach(() => {
      vi.clearAllMocks()
      request = {}
    })

    describe('when the personal field is accessible', () => {
      beforeEach(() => {
        isPersonalFieldAccessible.mockReturnValue(true)
      })

      test('it allows the request to continue for name field', () => {
        const guard = checkPersonalFieldAccessibleGuard('name')
        const result = guard.method(request, h)

        expect(isPersonalFieldAccessible).toHaveBeenCalledWith('name')
        expect(result).toBe(true)
        expect(h.redirect).not.toHaveBeenCalled()
      })

      test('it allows the request to continue for dob field', () => {
        const guard = checkPersonalFieldAccessibleGuard('dob')
        const result = guard.method(request, h)

        expect(isPersonalFieldAccessible).toHaveBeenCalledWith('dob')
        expect(result).toBe(true)
        expect(h.redirect).not.toHaveBeenCalled()
      })

      test('it allows the request to continue for address field', () => {
        const guard = checkPersonalFieldAccessibleGuard('address')
        const result = guard.method(request, h)

        expect(isPersonalFieldAccessible).toHaveBeenCalledWith('address')
        expect(result).toBe(true)
        expect(h.redirect).not.toHaveBeenCalled()
      })

      test('it allows the request to continue for phone field', () => {
        const guard = checkPersonalFieldAccessibleGuard('phone')
        const result = guard.method(request, h)

        expect(isPersonalFieldAccessible).toHaveBeenCalledWith('phone')
        expect(result).toBe(true)
        expect(h.redirect).not.toHaveBeenCalled()
      })

      test('it allows the request to continue for email field', () => {
        const guard = checkPersonalFieldAccessibleGuard('email')
        const result = guard.method(request, h)

        expect(isPersonalFieldAccessible).toHaveBeenCalledWith('email')
        expect(result).toBe(true)
        expect(h.redirect).not.toHaveBeenCalled()
      })
    })

    describe('when the personal field is not accessible', () => {
      beforeEach(() => {
        isPersonalFieldAccessible.mockReturnValue(false)
        takeoverMock = vi.fn().mockReturnValue({})
        h.redirect = vi.fn().mockReturnValue({ takeover: takeoverMock })
      })

      test('it redirects to the personal details page for name field', () => {
        const guard = checkPersonalFieldAccessibleGuard('name')
        guard.method(request, h)

        expect(isPersonalFieldAccessible).toHaveBeenCalledWith('name')
        expect(h.redirect).toHaveBeenCalledWith('/personal-details')
        expect(takeoverMock).toHaveBeenCalled()
      })

      test('it redirects to the personal details page for dob field', () => {
        const guard = checkPersonalFieldAccessibleGuard('dob')
        guard.method(request, h)

        expect(isPersonalFieldAccessible).toHaveBeenCalledWith('dob')
        expect(h.redirect).toHaveBeenCalledWith('/personal-details')
        expect(takeoverMock).toHaveBeenCalled()
      })

      test('it redirects to the personal details page for address field', () => {
        const guard = checkPersonalFieldAccessibleGuard('address')
        guard.method(request, h)

        expect(isPersonalFieldAccessible).toHaveBeenCalledWith('address')
        expect(h.redirect).toHaveBeenCalledWith('/personal-details')
        expect(takeoverMock).toHaveBeenCalled()
      })

      test('it redirects to the personal details page for phone field', () => {
        const guard = checkPersonalFieldAccessibleGuard('phone')
        guard.method(request, h)

        expect(isPersonalFieldAccessible).toHaveBeenCalledWith('phone')
        expect(h.redirect).toHaveBeenCalledWith('/personal-details')
        expect(takeoverMock).toHaveBeenCalled()
      })

      test('it redirects to the personal details page for email field', () => {
        const guard = checkPersonalFieldAccessibleGuard('email')
        guard.method(request, h)

        expect(isPersonalFieldAccessible).toHaveBeenCalledWith('email')
        expect(h.redirect).toHaveBeenCalledWith('/personal-details')
        expect(takeoverMock).toHaveBeenCalled()
      })
    })
  })

  describe('checkBusinessFixPermissionsPreHandler', () => {
    let request
    let sessionData

    beforeEach(() => {
      sessionData = {}

      request = {
        yar: {
          get: vi.fn(() => sessionData)
        },
        auth: {
          credentials: {
            scope: [AMEND_LEVEL_PERMISSION]
          }
        }
      }
    })

    describe('when the user has full permission', () => {
      beforeEach(() => {
        request.auth.credentials.scope = [FULL_PERMISSION]
        sessionData.orderedSectionsToFix = ['name', 'vat']
      })

      test('it should allow the request to continue', () => {
        const preHandler = checkBusinessFixPermissionsPreHandler(BUSINESS_DETAILS_VALIDATION_JOURNEY)
        const result = preHandler.method(request, h)

        expect(result).toBe(true)
        expect(h.redirect).not.toHaveBeenCalled()
      })
    })

    describe('when the user has make legal changes permission', () => {
      beforeEach(() => {
        request.auth.credentials.scope = [MAKE_LEGAL_CHANGES_PERMISSION]
        sessionData.orderedSectionsToFix = ['name', 'vat']
      })

      test('it should allow the request to continue', () => {
        const preHandler = checkBusinessFixPermissionsPreHandler(BUSINESS_DETAILS_VALIDATION_JOURNEY)
        const result = preHandler.method(request, h)

        expect(result).toBe(true)
        expect(h.redirect).not.toHaveBeenCalled()
      })
    })

    describe('when the user has amend permission', () => {
      describe('and the sections to fix include the VAT number', () => {
        beforeEach(() => {
          sessionData.orderedSectionsToFix = ['email', 'vat']
        })

        test('it should redirect to the business details page', () => {
          const preHandler = checkBusinessFixPermissionsPreHandler(BUSINESS_DETAILS_VALIDATION_JOURNEY)
          preHandler.method(request, h)

          expect(request.yar.get).toHaveBeenCalledWith('businessDetailsValidation')
          expect(h.redirect).toHaveBeenCalledWith('/business-details')
          expect(takeoverMock).toHaveBeenCalled()
        })
      })

      describe('and the sections needing update include the business name', () => {
        beforeEach(() => {
          sessionData.sectionsNeedingUpdate = ['name', 'phone']
        })

        test('it should redirect to the business details page', () => {
          const preHandler = checkBusinessFixPermissionsPreHandler(BUSINESS_DETAILS_VALIDATION_JOURNEY)
          preHandler.method(request, h)

          expect(h.redirect).toHaveBeenCalledWith('/business-details')
          expect(takeoverMock).toHaveBeenCalled()
        })
      })

      describe('and the source query parameter is the business name', () => {
        beforeEach(() => {
          request.query = { source: 'name' }
          sessionData.sectionsNeedingUpdate = ['email']
        })

        test('it should redirect to the business details page', () => {
          const preHandler = checkBusinessFixPermissionsPreHandler(BUSINESS_DETAILS_VALIDATION_JOURNEY)
          preHandler.method(request, h)

          expect(h.redirect).toHaveBeenCalledWith('/business-details')
          expect(takeoverMock).toHaveBeenCalled()
        })
      })

      describe('and the source query parameter is a section they can change', () => {
        beforeEach(() => {
          request.query = { source: 'email' }
          sessionData.sectionsNeedingUpdate = ['email']
        })

        test('it should allow the request to continue', () => {
          const preHandler = checkBusinessFixPermissionsPreHandler(BUSINESS_DETAILS_VALIDATION_JOURNEY)
          const result = preHandler.method(request, h)

          expect(result).toBe(true)
          expect(h.redirect).not.toHaveBeenCalled()
        })
      })

      describe('and the sections to fix are ones they can change', () => {
        beforeEach(() => {
          sessionData.orderedSectionsToFix = ['address', 'phone', 'email']
        })

        test('it should allow the request to continue', () => {
          const preHandler = checkBusinessFixPermissionsPreHandler(BUSINESS_DETAILS_VALIDATION_JOURNEY)
          const result = preHandler.method(request, h)

          expect(result).toBe(true)
          expect(h.redirect).not.toHaveBeenCalled()
        })
      })

      describe('and there is no fix journey session data', () => {
        beforeEach(() => {
          request.yar.get.mockReturnValue(null)
        })

        test('it should allow the request to continue', () => {
          const preHandler = checkBusinessFixPermissionsPreHandler(BUSINESS_DETAILS_VALIDATION_JOURNEY)
          const result = preHandler.method(request, h)

          expect(result).toBe(true)
          expect(h.redirect).not.toHaveBeenCalled()
        })
      })
    })
  })
})
