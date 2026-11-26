// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'
import { checkPersonalEmailRegisteredService } from '../../../../src/services/personal/check-personal-email-registered-service.js'
import { personalEmailChangeErrorService } from '../../../../src/services/personal/personal-email-change-error-service.js'

// Thing under test
import { personalEmailChangeRoutes } from '../../../../src/routes/personal/personal-email-change-routes.js'
const [getPersonalEmailChange, postPersonalEmailChange] = personalEmailChangeRoutes

// Mocks
vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

vi.mock('../../../../src/services/personal/fetch-personal-change-service.js', () => ({
  fetchPersonalChangeService: vi.fn()
}))

vi.mock('../../../../src/services/personal/check-personal-email-registered-service.js', () => ({
  checkPersonalEmailRegisteredService: vi.fn()
}))

vi.mock('../../../../src/services/personal/personal-email-change-error-service.js', () => ({
  personalEmailChangeErrorService: vi.fn()
}))

describe('personal email change', () => {
  let request
  let h

  const credentials = {
    crn: '987654321',
    email: 'test@example.com'
  }

  beforeEach(() => {
    vi.clearAllMocks()

    request = {
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

  describe('GET /account-email-change', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchPersonalChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method and path configured', () => {
        expect(getPersonalEmailChange.method).toBe('GET')
        expect(getPersonalEmailChange.path).toBe('/account-email-change')
      })

      test('should have a field accessibility guard pre-handler', () => {
        const fieldGuard = getPersonalEmailChange.options.pre[0]

        expect(getPersonalEmailChange.options.pre).toHaveLength(1)
        expect(fieldGuard).toBeDefined()
        expect(fieldGuard.method).toBeDefined()
      })

      test('it calls fetchPersonalChangeService', async () => {
        await getPersonalEmailChange.handler(request, h)

        expect(fetchPersonalChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changePersonalEmail')
      })

      test('should render personal-email-change view with page data', async () => {
        await getPersonalEmailChange.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('personal/personal-email-change', getPageData())
      })
    })
  })

  describe('POST /account-email-change', () => {
    describe('when a request succeeds', () => {
      beforeEach(() => {
        request.payload = { personalEmail: 'new-email@test.com' }

        fetchPersonalChangeService.mockResolvedValue({ ...getMockData(), changePersonalEmail: request.payload })
      })

      test('should have the correct method and path configured', () => {
        expect(postPersonalEmailChange.method).toBe('POST')
        expect(postPersonalEmailChange.path).toBe('/account-email-change')
      })

      test('should have a field accessibility guard pre-handler', () => {
        const fieldGuard = postPersonalEmailChange.options.pre[0]

        expect(postPersonalEmailChange.options.pre).toHaveLength(1)
        expect(fieldGuard).toBeDefined()
        expect(fieldGuard.method).toBeDefined()
      })

      describe('and the validation passes', () => {
        describe('and the email is not already registered', () => {
          beforeEach(() => {
            checkPersonalEmailRegisteredService.mockResolvedValue({})
          })

          test('it checks whether the email is already registered', async () => {
            await postPersonalEmailChange.options.handler(request, h)

            expect(checkPersonalEmailRegisteredService).toHaveBeenCalledWith(
              request.payload.personalEmail,
              request.auth.credentials
            )
          })

          test('it redirects to the /account-email-check page', async () => {
            await postPersonalEmailChange.options.handler(request, h)

            expect(h.redirect).toHaveBeenCalledWith('/account-email-check')
          })

          test('sets the payload on the yar state', async () => {
            await postPersonalEmailChange.options.handler(request, h)

            expect(setSessionData).toHaveBeenCalledWith(
              request.yar,
              'personalDetailsUpdate',
              'changePersonalEmail',
              request.payload.personalEmail
            )
          })
        })

        describe('and the email is already registered', () => {
          let error

          beforeEach(() => {
            error = [
              {
                message: 'This email address is already in use for another personal account. Enter a different email address.',
                path: ['personalEmail']
              }
            ]

            checkPersonalEmailRegisteredService.mockResolvedValue({ error })
            personalEmailChangeErrorService.mockResolvedValue(getPageDataRegisteredError())
          })

          test('it calls personalEmailChangeErrorService with the registered email error', async () => {
            await postPersonalEmailChange.options.handler(request, h)

            expect(personalEmailChangeErrorService).toHaveBeenCalledWith(
              request.yar,
              request.auth.credentials,
              request.payload.personalEmail,
              error
            )
          })

          test('it returns the page with the error summary banner and a bad request status', async () => {
            await postPersonalEmailChange.options.handler(request, h)

            expect(h.view).toHaveBeenCalledWith('personal/personal-email-change', getPageDataRegisteredError())
            expect(h.view.mock.results[0].value.code).toHaveBeenCalledWith(400)
          })

          test('it does not set the payload on the yar state', async () => {
            await postPersonalEmailChange.options.handler(request, h)

            expect(setSessionData).not.toHaveBeenCalled()
          })

          test('it does not redirect to the /account-email-check page', async () => {
            await postPersonalEmailChange.options.handler(request, h)

            expect(h.redirect).not.toHaveBeenCalled()
          })
        })
      })

      describe('and the validation fails', () => {
        let err

        beforeEach(() => {
          err = {
            details: [
              {
                message: 'Enter a personal email address',
                path: ['personalEmail'],
                type: 'string.empty'
              }
            ]
          }

          personalEmailChangeErrorService.mockResolvedValue(getPageDataError())
        })

        test('it calls personalEmailChangeErrorService with the validation errors', async () => {
          await postPersonalEmailChange.options.validate.failAction(request, h, err)

          expect(personalEmailChangeErrorService).toHaveBeenCalledWith(
            request.yar,
            request.auth.credentials,
            request.payload.personalEmail,
            err.details
          )
        })

        test('it returns the page with the error summary banner and a bad request status', async () => {
          await postPersonalEmailChange.options.validate.failAction(request, h, err)

          expect(h.view).toHaveBeenCalledWith('personal/personal-email-change', getPageDataError())
          expect(h.view.mock.results[0].value.code).toHaveBeenCalledWith(400)
        })
      })
    })
  })
})

const getMockData = () => {
  return {
    userName: 'Alfred Waldron',
    fullName: {
      first: 'Alfred',
      last: 'Waldron'
    },
    email: 'new-email@test.com'
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What is your personal email address?',
    metaDescription: 'Update the email address for your personal account.',
    userName: 'Alfred Waldron',
    personalEmail: 'new-email@test.com'
  }
}

const getPageDataError = () => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What is your personal email address?',
    metaDescription: 'Update the email address for your personal account.',
    userName: 'Alfred Waldron',
    personalEmail: 'new-email@test.com',
    errors: {
      personalEmail: {
        text: 'Enter a personal email address'
      }
    }
  }
}

const getPageDataRegisteredError = () => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What is your personal email address?',
    metaDescription: 'Update the email address for your personal account.',
    userName: 'Alfred Waldron',
    personalEmail: 'new-email@test.com',
    errors: {
      personalEmail: {
        text: 'This email address is already in use for another personal account. Enter a different email address.'
      }
    }
  }
}
