// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { utils, services } from '@defra/fcp-sfd-frontend-engine'
import { fetchPersonalFixService } from '../../../../src/services/personal/fetch-personal-fix-service.js'
import { checkPersonalEmailRegisteredService } from '../../../../src/services/personal/check-personal-email-registered-service.js'
import { personalFixListPresenter } from '../../../../src/presenters/personal/personal-fix-list-presenter.js'

// Thing under test
import { personalFixListRoutes } from '../../../../src/routes/personal/personal-fix-list-routes.js'
const [getPersonalFixList, postPersonalFixList] = personalFixListRoutes

// Mocks
vi.mock('@defra/fcp-sfd-frontend-engine', () => ({
  utils: { formatValidationErrors: vi.fn() },
  schemas: { personal: {} },
  constants: { statusCodes: { BAD_REQUEST: 400 } },
  services: {
    validateFixDetails: vi.fn(),
    setFixSessionData: vi.fn()
  }
}))

vi.mock('../../../../src/services/personal/fetch-personal-fix-service.js', () => ({
  fetchPersonalFixService: vi.fn()
}))

vi.mock('../../../../src/services/personal/check-personal-email-registered-service.js', () => ({
  checkPersonalEmailRegisteredService: vi.fn()
}))

vi.mock('../../../../src/presenters/personal/personal-fix-list-presenter.js', () => ({
  personalFixListPresenter: vi.fn()
}))

describe('personal fix list routes', () => {
  let request
  let h
  let sessionData

  const credentials = {
    crn: '987654321',
    email: 'test@example.com'
  }

  beforeEach(() => {
    vi.clearAllMocks()

    sessionData = {
      orderedSectionsToFix: ['name', 'email']
    }

    request = {
      yar: {
        get: vi.fn(() => sessionData)
      },
      auth: { credentials },
      payload: {}
    }

    const responseStub = {
      code: vi.fn().mockReturnThis(),
      takeover: vi.fn().mockReturnThis()
    }

    h = {
      redirect: vi.fn(),
      view: vi.fn(() => responseStub)
    }
  })

  describe('GET /personal-fix-list', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchPersonalFixService.mockResolvedValue({ some: 'data' })
        personalFixListPresenter.mockReturnValue({ page: 'data' })
      })

      test('should have the correct method and path configured', () => {
        expect(getPersonalFixList.method).toBe('GET')
        expect(getPersonalFixList.path).toBe('/personal-fix-list')
      })

      test('it fetches personal fix data', async () => {
        await getPersonalFixList.handler(request, h)

        expect(fetchPersonalFixService).toHaveBeenCalledWith(credentials, sessionData)
      })

      test('should render personal-fix-list view with page data', async () => {
        await getPersonalFixList.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('personal/personal-fix-list.njk', { page: 'data' })
      })
    })
  })

  describe('POST /personal-fix-list', () => {
    describe('when a request succeeds', () => {
      beforeEach(() => {
        request.payload = {
          first: 'John',
          personalEmail: 'john@example.com'
        }

        services.validateFixDetails.mockReturnValue({})
        checkPersonalEmailRegisteredService.mockResolvedValue({})
      })

      test('should have the correct method and path configured', () => {
        expect(postPersonalFixList.method).toBe('POST')
        expect(postPersonalFixList.path).toBe('/personal-fix-list')
      })

      describe('when validation passes', () => {
        test('it checks whether the personal email is already registered', async () => {
          await postPersonalFixList.handler(request, h)

          expect(checkPersonalEmailRegisteredService).toHaveBeenCalledWith('john@example.com', credentials)
        })

        test('it stores the session data and redirects', async () => {
          await postPersonalFixList.handler(request, h)

          expect(services.setFixSessionData).toHaveBeenCalledWith(request.yar, sessionData, request.payload, 'personalDetailsValidation', 'personalFixUpdates')
          expect(h.redirect).toHaveBeenCalledWith('/personal-fix-check')
        })
      })

      describe('when email is not a section to fix', () => {
        beforeEach(() => {
          sessionData.orderedSectionsToFix = ['name']
        })

        test('it does not check whether the personal email is already registered', async () => {
          await postPersonalFixList.handler(request, h)

          expect(checkPersonalEmailRegisteredService).not.toHaveBeenCalled()
        })
      })

      describe('and the personal email is already registered', () => {
        let emailError
        let errors

        beforeEach(() => {
          emailError = [{ message: 'This email address is already in use for another personal account. Enter a different email address.', path: ['personalEmail'] }]
          errors = { personalEmail: { text: 'This email address is already in use for another personal account. Enter a different email address.' } }

          checkPersonalEmailRegisteredService.mockResolvedValue({ error: emailError })
          utils.formatValidationErrors.mockReturnValue(errors)
          fetchPersonalFixService.mockResolvedValue({ some: 'data' })
          personalFixListPresenter.mockReturnValue({ page: 'data', errors })
        })

        test('it formats the email error', async () => {
          await postPersonalFixList.handler(request, h)

          expect(utils.formatValidationErrors).toHaveBeenCalledWith(emailError)
        })

        test('it returns the page with the email error and a bad request status', async () => {
          await postPersonalFixList.handler(request, h)

          expect(h.view).toHaveBeenCalledWith('personal/personal-fix-list.njk', { page: 'data', errors })
          expect(h.view().code).toHaveBeenCalledWith(400)
        })

        test('it does not store the session data or redirect', async () => {
          await postPersonalFixList.handler(request, h)

          expect(services.setFixSessionData).not.toHaveBeenCalled()
          expect(h.redirect).not.toHaveBeenCalled()
        })
      })

      describe('and the validation fails', () => {
        let validationError
        let errors

        beforeEach(() => {
          validationError = {
            details: [
              {
                message: 'Enter your first name',
                path: ['first']
              }
            ]
          }

          errors = [
            { field: 'first', message: 'Enter your first name' }
          ]

          services.validateFixDetails.mockReturnValue({ error: validationError })
          utils.formatValidationErrors.mockReturnValue(errors)
          fetchPersonalFixService.mockResolvedValue({ some: 'data' })
          personalFixListPresenter.mockReturnValue({ page: 'data', errors })
        })

        test('it formats validation errors', async () => {
          await postPersonalFixList.handler(request, h)

          expect(utils.formatValidationErrors).toHaveBeenCalledWith(validationError.details)
        })

        test('it does not check whether the personal email is already registered', async () => {
          await postPersonalFixList.handler(request, h)

          expect(checkPersonalEmailRegisteredService).not.toHaveBeenCalled()
        })

        test('it fetches personal fix data', async () => {
          await postPersonalFixList.handler(request, h)

          expect(fetchPersonalFixService).toHaveBeenCalledWith(credentials, sessionData)
        })

        test('it returns the page successfully with the error summary banner', async () => {
          await postPersonalFixList.handler(request, h)

          expect(h.view).toHaveBeenCalledWith('personal/personal-fix-list.njk', { page: 'data', errors })
        })
      })
    })
  })
})
