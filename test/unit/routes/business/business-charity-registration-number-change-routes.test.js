// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'

// Test helpers
import { LEGAL_PERMISSIONS } from '../../../../src/constants/scope/business-details.js'

// Thing under test
import { businessCharityRegistrationNumberChangeRoutes } from '../../../../src/routes/business/business-charity-registration-number-change-routes.js'
const [getBusinessCharityRegistrationNumberChange, postBusinessCharityRegistrationNumberChange] = businessCharityRegistrationNumberChangeRoutes

// Mocks
vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

vi.mock('../../../../src/services/business/fetch-business-change-service.js', () => ({
  fetchBusinessChangeService: vi.fn()
}))

vi.mock('../../../../src/services/business/fetch-business-details-service.js', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

describe('business charity commission registration number change', () => {
  let request
  let h

  const credentials = {
    sbi: '800000001',
    crn: '9000000001',
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

  describe('GET /business-charity-registration-number-change', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchBusinessChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method, path and auth scope configured', () => {
        expect(getBusinessCharityRegistrationNumberChange.method).toBe('GET')
        expect(getBusinessCharityRegistrationNumberChange.path).toBe('/business-charity-registration-number-change')
        expect(getBusinessCharityRegistrationNumberChange.options.auth.scope).toBe(LEGAL_PERMISSIONS)
      })

      test('it calls fetchBusinessChangeService', async () => {
        await getBusinessCharityRegistrationNumberChange.handler(request, h)

        expect(fetchBusinessChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changeBusinessCharityRegistrationNumber')
      })

      test('should render business-charity-registration-number-change view with page data', async () => {
        await getBusinessCharityRegistrationNumberChange.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-charity-registration-number-change', getPageData())
      })
    })
  })

  describe('legal status guard', () => {
    const guardRequest = { auth: { credentials: { sbi: '800000001' } } }
    const redirectStub = {}
    const h = {
      continue: Symbol('continue'),
      redirect: vi.fn().mockReturnValue({ takeover: vi.fn().mockReturnValue(redirectStub) })
    }

    describe('when the business has a charity legal status', () => {
      beforeEach(() => {
        fetchBusinessDetailsService.mockResolvedValue({ legalStatusCode: '102101' })
      })

      describe('and the request is a GET', () => {
        test('it allows access', async () => {
          const guard = getBusinessCharityRegistrationNumberChange.options.pre.at(-1)

          expect(await guard.method(guardRequest, h)).toBe(h.continue)
        })
      })

      describe('and the request is a POST', () => {
        test('it allows access', async () => {
          const guard = postBusinessCharityRegistrationNumberChange.options.pre.at(-1)

          expect(await guard.method(guardRequest, h)).toBe(h.continue)
        })
      })
    })

    describe('when the business does not have a charity legal status', () => {
      beforeEach(() => {
        fetchBusinessDetailsService.mockResolvedValue({ legalStatusCode: '102102' })
      })

      describe('and the request is a GET', () => {
        test('it redirects to the home page', async () => {
          const guard = getBusinessCharityRegistrationNumberChange.options.pre.at(-1)
          const result = await guard.method(guardRequest, h)

          expect(h.redirect).toHaveBeenCalledWith('/home')
          expect(result).toBe(redirectStub)
        })
      })

      describe('and the request is a POST', () => {
        test('it redirects to the home page', async () => {
          const guard = postBusinessCharityRegistrationNumberChange.options.pre.at(-1)
          const result = await guard.method(guardRequest, h)

          expect(h.redirect).toHaveBeenCalledWith('/home')
          expect(result).toBe(redirectStub)
        })
      })
    })
  })

  describe('POST /business-charity-registration-number-change', () => {
    describe('when a request succeeds', () => {
      beforeEach(() => {
        request.payload = { charityCommissionRegistrationNumber: '12345678' }

        fetchBusinessChangeService.mockResolvedValue({ ...getMockData(), changeBusinessCharityRegistrationNumber: request.payload })
      })

      test('should have the correct method, path and auth scope configured', () => {
        expect(postBusinessCharityRegistrationNumberChange.method).toBe('POST')
        expect(postBusinessCharityRegistrationNumberChange.path).toBe('/business-charity-registration-number-change')
        expect(postBusinessCharityRegistrationNumberChange.options.auth.scope).toBe(LEGAL_PERMISSIONS)
      })

      describe('and the validation passes', () => {
        test('it redirects to the /business-charity-registration-number-check page', async () => {
          await postBusinessCharityRegistrationNumberChange.options.handler(request, h)

          expect(h.redirect).toHaveBeenCalledWith('/business-charity-registration-number-check')
        })

        test('sets the payload on the yar state', async () => {
          await postBusinessCharityRegistrationNumberChange.options.handler(request, h)

          expect(setSessionData).toHaveBeenCalledWith(
            request.yar,
            'businessDetailsUpdate',
            'changeBusinessCharityRegistrationNumber',
            request.payload.charityCommissionRegistrationNumber
          )
        })
      })

      describe('and the validation fails', () => {
        let err

        beforeEach(() => {
          err = {
            details: [
              {
                message: 'Enter the charity commission registration number',
                path: ['charityCommissionRegistrationNumber'],
                type: 'any.required'
              }
            ]
          }
        })

        test('it fetches the business details', async () => {
          await postBusinessCharityRegistrationNumberChange.options.validate.failAction(request, h, err)

          expect(fetchBusinessChangeService).toHaveBeenCalledWith(
            request.yar,
            request.auth.credentials,
            'changeBusinessCharityRegistrationNumber'
          )
        })

        test('it returns the page successfully with the error summary banner', async () => {
          await postBusinessCharityRegistrationNumberChange.options.validate.failAction(request, h, err)

          expect(h.view).toHaveBeenCalledWith('business/business-charity-registration-number-change', getPageDataError())
        })

        test('it should handle undefined errors', async () => {
          await postBusinessCharityRegistrationNumberChange.options.validate.failAction(request, h, [])

          const pageData = getPageDataError()
          pageData.errors = {}

          expect(h.view).toHaveBeenCalledWith('business/business-charity-registration-number-change', pageData)
        })
      })
    })
  })
})

const getMockData = () => {
  return {
    businessName: 'Agile Farm Ltd',
    sbi: '800000001',
    registrationNumbers: {
      companiesHouse: null,
      charityCommission: '12345678'
    },
    customer: {
      userName: 'Alfred Waldron'
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Enter the charity commission registration number',
    metaDescription: 'Update the charity commission registration number for your business.',
    businessName: 'Agile Farm Ltd',
    sbi: '800000001',
    userName: 'Alfred Waldron',
    charityCommissionRegistrationNumber: '12345678'
  }
}

const getPageDataError = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Enter the charity commission registration number',
    metaDescription: 'Update the charity commission registration number for your business.',
    businessName: 'Agile Farm Ltd',
    sbi: '800000001',
    userName: 'Alfred Waldron',
    charityCommissionRegistrationNumber: '12345678',
    errors: {
      charityCommissionRegistrationNumber: {
        text: 'Enter the charity commission registration number'
      }
    }
  }
}
