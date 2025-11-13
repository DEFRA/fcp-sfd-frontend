// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'

// Test helpers
import { VIEW_PERMISSIONS } from '../../../../src/constants/scope/business-details.js'

// Thing under test
import { personalNameChangeRoutes } from '../../../../src/routes/personal/personal-name-change-routes.js'
const [getPersonalNameChange, postPersonalNameChange] = personalNameChangeRoutes

// Mocks
vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

vi.mock('../../../../src/services/personal/fetch-personal-change-service.js', () => ({
  fetchPersonalChangeService: vi.fn()
}))

describe('personal name change', () => {
  let request
  let h

  const credentials = {
    crn: '987654321',
    email: 'test@example.com'
  }

  beforeEach(() => {
    vi.clearAllMocks()

    request = {
      yar: {},
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

  describe('GET /personal-name-change', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchPersonalChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method, path and auth scope configured', () => {
        expect(getPersonalNameChange.method).toBe('GET')
        expect(getPersonalNameChange.path).toBe('/account-name-change')
        expect(getPersonalNameChange.options.auth.scope).toBe(VIEW_PERMISSIONS)
      })

      test('it fetches the data from the session', async () => {
        await getPersonalNameChange.handler(request, h)

        expect(fetchPersonalChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changePersonalName')
      })

      test('it renders the personal-name-change view with correct page data', async () => {
        await getPersonalNameChange.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('personal/personal-name-change', getPageData())
      })
    })
  })

  describe('POST /personal-name-change', () => {
    beforeEach(() => {
      request.payload = {
        first: 'John',
        middle: 'A',
        last: 'Doe'
      }

      fetchPersonalChangeService.mockResolvedValue({ ...getMockData(), changePersonalName: request.payload })
    })

    describe('when a request succeeds', () => {
      test('should have the correct method, path and auth scope configured', () => {
        expect(postPersonalNameChange.method).toBe('POST')
        expect(postPersonalNameChange.path).toBe('/account-name-change')
        expect(postPersonalNameChange.options.auth.scope).toBe(VIEW_PERMISSIONS)
      })

      describe('and the validation passes', () => {
        test('it sets the session data and redirects', async () => {
          await postPersonalNameChange.options.handler(request, h)

          expect(setSessionData).toHaveBeenCalledWith(
            request.yar,
            'personalDetails',
            'changePersonalName',
            request.payload
          )
          expect(h.redirect).toHaveBeenCalledWith('/account-name-check')
        })
      })

      describe('and the validation fails', () => {
        let err

        beforeEach(() => {
          err = {
            details: [
              {
                message: 'Enter your first name',
                path: ['first'],
                type: 'string.empty'
              }
            ]
          }
        })

        test('it fetches the personal details', async () => {
          await postPersonalNameChange.options.validate.failAction(request, h, err)

          expect(fetchPersonalChangeService).toHaveBeenCalledWith(
            request.yar,
            request.auth.credentials,
            'changePersonalName'
          )
        })

        test('it returns the page successfully with the error summary banner', async () => {
          await postPersonalNameChange.options.validate.failAction(request, h, err)

          expect(h.view).toHaveBeenCalledWith('personal/personal-name-change', getPageDataError())
        })
      })

      test('it should handle undefined errors', async () => {
        await postPersonalNameChange.options.validate.failAction(request, h, [])

        const pageData = getPageDataError()
        pageData.errors = {}

        expect(h.view).toHaveBeenCalledWith('personal/personal-name-change', pageData)
      })
    })
  })
})

const getMockData = () => {
  return {
    info: {
      fullName: {
        fullNameJoined: 'Alfred Waldron',
        first: 'Alfred',
        middle: 'M',
        last: 'Waldron'
      }
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What is your full name?',
    metaDescription: 'Update the full name for your personal account.',
    userName: 'Alfred Waldron',
    first: 'Alfred',
    middle: 'M',
    last: 'Waldron'
  }
}

const getPageDataError = () => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What is your full name?',
    metaDescription: 'Update the full name for your personal account.',
    userName: 'Alfred Waldron',
    first: 'John',
    middle: 'A',
    last: 'Doe',
    errors: {
      first: {
        text: 'Enter your first name'
      }
    }
  }
}
