// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'

// Test helpers
import { VIEW_PERMISSIONS } from '../../../../src/constants/scope/business-details.js'

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

      test('should have the correct method, path and auth scope configured', () => {
        expect(getPersonalEmailChange.method).toBe('GET')
        expect(getPersonalEmailChange.path).toBe('/account-email-change')
        expect(getPersonalEmailChange.options.auth.scope).toBe(VIEW_PERMISSIONS)
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

      test('should have the correct method, path and auth scope configured', () => {
        expect(postPersonalEmailChange.method).toBe('POST')
        expect(postPersonalEmailChange.path).toBe('/account-email-change')
        expect(postPersonalEmailChange.options.auth.scope).toBe(VIEW_PERMISSIONS)
      })

      describe('and the validation passes', () => {
        test('it redirects to the /account-email-check page', async () => {
          await postPersonalEmailChange.options.handler(request, h)

          expect(h.redirect).toHaveBeenCalledWith('/account-email-check')
        })

        test('sets the payload on the yar state', async () => {
          await postPersonalEmailChange.options.handler(request, h)

          expect(setSessionData).toHaveBeenCalledWith(
            request.yar,
            'personalDetails',
            'changePersonalEmail',
            request.payload.personalEmail
          )
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
        })

        test('it fetches the personal details', async () => {
          await postPersonalEmailChange.options.validate.failAction(request, h, err)

          expect(fetchPersonalChangeService).toHaveBeenCalledWith(
            request.yar,
            request.auth.credentials,
            'changePersonalEmail'
          )
        })

        test('it returns the page successfully with the error summary banner', async () => {
          await postPersonalEmailChange.options.validate.failAction(request, h, err)

          expect(h.view).toHaveBeenCalledWith('personal/personal-email-change', getPageDataError())
        })

        test('it should handle undefined errors', async () => {
          await postPersonalEmailChange.options.validate.failAction(request, h, [])

          const pageData = getPageDataError()
          pageData.errors = {}

          expect(h.view).toHaveBeenCalledWith('personal/personal-email-change', pageData)
        })
      })
    })
  })
})

const getMockData = () => {
  return {
    info: {
      fullName: {
        fullNameJoined: 'Alfred Waldron'
      }
    },
    contact: {
      email: 'new-email@test.com'
    }
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
