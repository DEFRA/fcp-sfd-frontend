// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'
import { config } from '../../../../src/config/index.js'
import { isPersonalFieldAccessible } from '../../../../src/utils/feature-toggle/check-field-accessibility.js'
import { getDisabledFieldNotification } from '../../../../src/utils/feature-toggle/check-field-accessibility.js'

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

vi.mock('../../../../src/config/index.js', () => ({
  config: {
    get: vi.fn()
  }
}))

vi.mock('../../../../src/utils/feature-toggle/check-field-accessibility.js', () => ({
  isPersonalFieldAccessible: vi.fn(),
  getDisabledFieldNotification: vi.fn()
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

    // Default: all fields accessible, config returns true
    config.get.mockReturnValue(true)
    isPersonalFieldAccessible.mockReturnValue(true)
    getDisabledFieldNotification.mockReturnValue(null)
  })

  describe('GET /personal-name-change', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchPersonalChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method and path configured', () => {
        expect(getPersonalNameChange.method).toBe('GET')
        expect(getPersonalNameChange.path).toBe('/account-name-change')
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
      test('should have the correct method and path configured', () => {
        expect(postPersonalNameChange.method).toBe('POST')
        expect(postPersonalNameChange.path).toBe('/account-name-change')
      })

      describe('and the validation passes', () => {
        test('it sets the session data and redirects', async () => {
          await postPersonalNameChange.options.handler(request, h)

          expect(setSessionData).toHaveBeenCalledWith(
            request.yar,
            'personalDetailsUpdate',
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
    userName: 'Alfred Waldron',
    fullName: {
      first: 'Alfred',
      middle: 'M',
      last: 'Waldron'
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

describe('feature toggles - personal name field', () => {
  beforeEach(() => {
    fetchPersonalChangeService.mockReturnValue(getMockData())
  })

  describe('when personal name field is disabled', () => {
    beforeEach(() => {
      isPersonalFieldAccessible.mockReturnValue(false)
      getDisabledFieldNotification.mockReturnValue({
        type: 'error',
        titleText: 'Important',
        text: 'Sorry, there is a problem with the service. You cannot update your full name right now. Please try again later.'
      })
    })

    describe('on GET request', () => {
      test('returns 423 LOCKED status', async () => {
        const responseStub = {
          code: vi.fn().mockReturnThis(),
          takeover: vi.fn().mockReturnThis()
        }

        h.view.mockReturnValue(responseStub)

        await getPersonalNameChange.handler(request, h)

        expect(responseStub.code).toHaveBeenCalledWith(423)
      })

      test('renders the view with error notification', async () => {
        const responseStub = {
          code: vi.fn().mockReturnThis(),
          takeover: vi.fn().mockReturnThis()
        }

        h.view.mockReturnValue(responseStub)

        await getPersonalNameChange.handler(request, h)

        const callArgs = h.view.mock.calls[0]
        expect(callArgs[1].notification).toBeDefined()
        expect(callArgs[1].notification.type).toBe('error')
      })
    })

    describe('on POST request', () => {
      beforeEach(() => {
        request.payload = {
          first: 'John',
          middle: 'A',
          last: 'Doe'
        }
      })

      test('returns 423 LOCKED status', async () => {
        const responseStub = {
          code: vi.fn().mockReturnThis(),
          takeover: vi.fn().mockReturnThis()
        }

        h.view.mockReturnValue(responseStub)

        await postPersonalNameChange.options.handler(request, h)

        expect(responseStub.code).toHaveBeenCalledWith(423)
      })

      test('does not proceed with submission', async () => {
        const responseStub = {
          code: vi.fn().mockReturnThis(),
          takeover: vi.fn().mockReturnThis()
        }

        h.view.mockReturnValue(responseStub)

        await postPersonalNameChange.options.handler(request, h)

        expect(setSessionData).not.toHaveBeenCalled()
        expect(h.redirect).not.toHaveBeenCalled()
      })

      test('renders the view with error notification', async () => {
        const responseStub = {
          code: vi.fn().mockReturnThis(),
          takeover: vi.fn().mockReturnThis()
        }

        h.view.mockReturnValue(responseStub)

        await postPersonalNameChange.options.handler(request, h)

        const callArgs = h.view.mock.calls[0]
        expect(callArgs[1].notification).toBeDefined()
        expect(callArgs[1].notification.type).toBe('error')
      })
    })

    describe('on POST request validation failure', () => {
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

      test('returns 423 LOCKED status instead of validation error', async () => {
        const responseStub = {
          code: vi.fn().mockReturnThis(),
          takeover: vi.fn().mockReturnThis()
        }

        h.view.mockReturnValue(responseStub)

        await postPersonalNameChange.options.validate.failAction(request, h, err)

        expect(responseStub.code).toHaveBeenCalledWith(423)
      })

      test('renders the view with error notification', async () => {
        const responseStub = {
          code: vi.fn().mockReturnThis(),
          takeover: vi.fn().mockReturnThis()
        }

        h.view.mockReturnValue(responseStub)

        await postPersonalNameChange.options.validate.failAction(request, h, err)

        const callArgs = h.view.mock.calls[0]
        expect(callArgs[1].notification).toBeDefined()
        expect(callArgs[1].notification.type).toBe('error')
      })
    })
  })

  describe('when personal name field is enabled', () => {
    beforeEach(() => {
      isPersonalFieldAccessible.mockReturnValue(true)
      getDisabledFieldNotification.mockReturnValue(null)
      fetchPersonalChangeService.mockReturnValue(getMockData())
    })

    describe('on GET request', () => {
      test('does not return 423 LOCKED status', async () => {
        await getPersonalNameChange.handler(request, h)

        const responseStub = h.view.mock.results[0].value
        expect(responseStub.code).not.toHaveBeenCalledWith(423)
      })

      test('renders normally without error notification', async () => {
        await getPersonalNameChange.handler(request, h)

        const callArgs = h.view.mock.calls[0]
        expect(callArgs[0]).toBe('personal/personal-name-change')
      })
    })

    describe('on POST request', () => {
      beforeEach(() => {
        request.payload = {
          first: 'John',
          middle: 'A',
          last: 'Doe'
        }

        fetchPersonalChangeService.mockResolvedValue({ ...getMockData(), changePersonalName: request.payload })
      })

      test('proceeds with normal submission', async () => {
        await postPersonalNameChange.options.handler(request, h)

        expect(setSessionData).toHaveBeenCalled()
        expect(h.redirect).toHaveBeenCalledWith('/account-name-check')
      })
    })
  })
})

