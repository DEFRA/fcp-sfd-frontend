// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'

// Thing under test
import { businessNameChangeRoutes } from '../../../../src/routes/business/business-name-change-routes.js'
const [getBusinessNameChange, postBusinessNameChange] = businessNameChangeRoutes

// Mocks
vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

vi.mock('../../../../src/services/business/fetch-business-change-service.js', () => ({
  fetchBusinessChangeService: vi.fn()
}))

describe('business name change', () => {
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
      yar: { set: vi.fn(), get: vi.fn() },
      auth: { credentials },
      payload: {}
    }

    // Fix for h.view to allow .code().takeover() chaining
    const responseStub = {
      code: vi.fn().mockReturnThis(),
      takeover: vi.fn().mockReturnThis()
    }

    h = {
      redirect: vi.fn(),
      view: vi.fn(() => responseStub)
    }
  })

  describe('GET /business-name-change', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchBusinessChangeService.mockResolvedValue({
          info: { businessName: 'Agile Farm Ltd', sbi: '123456789' },
          customer: { fullName: 'Alfred Waldron' }
        })
      })

      test('should have the correct method and path', () => {
        expect(getBusinessNameChange.method).toBe('GET')
        expect(getBusinessNameChange.path).toBe('/business-name-change')
      })

      test('it calls fetchBusinessChangeService', async () => {
        await getBusinessNameChange.handler(request, h)

        expect(fetchBusinessChangeService).toHaveBeenCalledWith(request.yar, credentials, 'changeBusinessName')
      })

      test('it renders the business-name-change view with correct page data', async () => {
        await getBusinessNameChange.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-name-change', getPageData())
      })
    })
  })

  describe('POST /business-name-change', () => {
    describe('when a request succeeds', () => {
      beforeEach(() => {
        request.payload = { businessName: 'New business Name ltd' }

        fetchBusinessChangeService.mockResolvedValue({
          info: { businessName: 'Agile Farm Ltd', sbi: '123456789' },
          customer: { fullName: 'Alfred Waldron' },
          changeBusinessName: request.payload.businessName
        })
      })

      describe('and the validation passes', () => {
        test('it sets the session data and redirects', async () => {
          await postBusinessNameChange.options.handler(request, h)

          expect(setSessionData).toHaveBeenCalledWith(
            request.yar,
            'businessDetails',
            'changeBusinessName',
            request.payload.businessName
          )
          expect(h.redirect).toHaveBeenCalledWith('/business-name-check')
        })
      })

      describe('and the validation fails', () => {
        let err

        beforeEach(() => {
          err = {
            details: [
              {
                message: 'Enter business name',
                path: ['businessName'],
                type: 'string.empty'
              }
            ]
          }
        })

        test('it returns the page successfully with the error summary banner', async () => {
          await postBusinessNameChange.options.validate.failAction(request, h, err)

          expect(h.view).toHaveBeenCalledWith('business/business-name-change', getPageDataError())
        })

        test('it should handle undefined errors', async () => {
          await postBusinessNameChange.options.validate.failAction(request, h, [])

          const pageData = getPageDataError()
          pageData.errors = {}

          expect(h.view).toHaveBeenCalledWith('business/business-name-change', pageData)
        })
      })
    })
  })
})

const getPageData = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'What is your business name?',
    metaDescription: 'Update the name for your business.',
    businessName: 'Agile Farm Ltd',
    changeBusinessName: 'Agile Farm Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron'
  }
}

const getPageDataError = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'What is your business name?',
    metaDescription: 'Update the name for your business.',
    changeBusinessName: 'New business Name ltd',
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron',
    errors: {
      businessName: {
        text: 'Enter business name'
      }
    }
  }
}
