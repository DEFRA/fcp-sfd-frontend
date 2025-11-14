// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'

// Test helpers
import { AMEND_PERMISSIONS } from '../../../../src/constants/scope/business-details.js'

// Thing under test
import { businessEmailChangeRoutes } from '../../../../src/routes/business/business-email-change-routes.js'
const [getBusinessEmailChange, postBusinessEmailChange] = businessEmailChangeRoutes

// Mocks
vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

vi.mock('../../../../src/services/business/fetch-business-change-service.js', () => ({
  fetchBusinessChangeService: vi.fn()
}))

describe('business email change', () => {
  let request
  let h

  const credentials = {
    sbi: '123456789',
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

  describe('GET /business-email-change', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchBusinessChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method, path and auth scope configured', () => {
        expect(getBusinessEmailChange.method).toBe('GET')
        expect(getBusinessEmailChange.path).toBe('/business-email-change')
        expect(getBusinessEmailChange.options.auth.scope).toBe(AMEND_PERMISSIONS)
      })

      test('it calls fetchBusinessChangeService', async () => {
        await getBusinessEmailChange.handler(request, h)

        expect(fetchBusinessChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changeBusinessEmail')
      })

      test('should render business-email-change view with page data', async () => {
        await getBusinessEmailChange.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-email-change', getPageData())
      })
    })
  })

  describe('POST /business-email-change', () => {
    describe('when a request succeeds', () => {
      beforeEach(() => {
        request.payload = { businessEmail: 'new-email@test.com' }

        fetchBusinessChangeService.mockResolvedValue({ ...getMockData(), changeBusinessEmail: request.payload })
      })

      test('should have the correct method, path and auth scope configured', () => {
        expect(postBusinessEmailChange.method).toBe('POST')
        expect(postBusinessEmailChange.path).toBe('/business-email-change')
        expect(postBusinessEmailChange.options.auth.scope).toBe(AMEND_PERMISSIONS)
      })

      describe('and the validation passes', () => {
        test('it redirects to the /business-email-check page', async () => {
          await postBusinessEmailChange.options.handler(request, h)

          expect(h.redirect).toHaveBeenCalledWith('/business-email-check')
        })

        test('sets the payload on the yar state', async () => {
          await postBusinessEmailChange.options.handler(request, h)

          expect(setSessionData).toHaveBeenCalledWith(
            request.yar,
            'businessDetails',
            'changeBusinessEmail',
            request.payload.businessEmail
          )
        })
      })

      describe('and the validation fails', () => {
        let err

        beforeEach(() => {
          err = {
            details: [
              {
                message: 'Enter business email address',
                path: ['businessEmail'],
                type: 'string.empty'
              }
            ]
          }
        })

        test('it fetches the business details', async () => {
          await postBusinessEmailChange.options.validate.failAction(request, h, err)

          expect(fetchBusinessChangeService).toHaveBeenCalledWith(
            request.yar,
            request.auth.credentials,
            'changeBusinessEmail'
          )
        })

        test('it returns the page successfully with the error summary banner', async () => {
          await postBusinessEmailChange.options.validate.failAction(request, h, err)

          expect(h.view).toHaveBeenCalledWith('business/business-email-change', getPageDataError())
        })

        test('it should handle undefined errors', async () => {
          await postBusinessEmailChange.options.validate.failAction(request, h, [])

          const pageData = getPageDataError()
          pageData.errors = {}

          expect(h.view).toHaveBeenCalledWith('business/business-email-change', pageData)
        })
      })
    })
  })
})

const getMockData = () => {
  return {
    info: {
      sbi: '123456789',
      businessName: 'Agile Farm Ltd'
    },
    customer: {
      userName: 'Alfred Waldron'
    },
    contact: {
      email: 'new-email@test.com'
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'What is your business email address?',
    metaDescription: 'Update the email address for your business.',
    businessEmail: 'new-email@test.com',
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron'
  }
}

const getPageDataError = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'What is your business email address?',
    metaDescription: 'Update the email address for your business.',
    businessEmail: 'new-email@test.com',
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron',
    errors: {
      businessEmail: {
        text: 'Enter business email address'
      }
    }
  }
}
