// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'

// Test helpers
import { FULL_PERMISSIONS } from '../../../../src/constants/scope/business-details.js'

// Thing under test
import { businessCompanyRegistrationNumberChangeRoutes } from '../../../../src/routes/business/business-company-registration-number-change-routes.js'
const [getBusinessCompanyRegistrationNumberChange, postBusinessCompanyRegistrationNumberChange] = businessCompanyRegistrationNumberChangeRoutes

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

describe('business company registration number change', () => {
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

  describe('GET /business-company-registration-number-change', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchBusinessChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method, path and auth scope configured', () => {
        expect(getBusinessCompanyRegistrationNumberChange.method).toBe('GET')
        expect(getBusinessCompanyRegistrationNumberChange.path).toBe('/business-company-registration-number-change')
        expect(getBusinessCompanyRegistrationNumberChange.options.auth.scope).toBe(FULL_PERMISSIONS)
      })

      test('it calls fetchBusinessChangeService', async () => {
        await getBusinessCompanyRegistrationNumberChange.handler(request, h)

        expect(fetchBusinessChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changeBusinessCompanyRegistrationNumber')
      })

      test('should render business-company-registration-number-change view with page data', async () => {
        await getBusinessCompanyRegistrationNumberChange.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-company-registration-number-change', getPageData())
      })
    })
  })

  describe('legal status guard', () => {
    const guardRequest = { auth: { credentials: { sbi: '800000001' } } }
    const h = { continue: Symbol('continue') }

    describe('when the business has a company legal status', () => {
      beforeEach(() => {
        fetchBusinessDetailsService.mockResolvedValue({ legalStatusCode: '102102' })
      })

      describe('and the request is a GET', () => {
        test('it allows access', async () => {
          const guard = getBusinessCompanyRegistrationNumberChange.options.pre.at(-1)

          expect(await guard.method(guardRequest, h)).toBe(h.continue)
        })
      })

      describe('and the request is a POST', () => {
        test('it allows access', async () => {
          const guard = postBusinessCompanyRegistrationNumberChange.options.pre.at(-1)

          expect(await guard.method(guardRequest, h)).toBe(h.continue)
        })
      })
    })

    describe('when the business does not have a company legal status', () => {
      beforeEach(() => {
        fetchBusinessDetailsService.mockResolvedValue({ legalStatusCode: '102101' })
      })

      describe('and the request is a GET', () => {
        test('it returns a 404', async () => {
          const guard = getBusinessCompanyRegistrationNumberChange.options.pre.at(-1)

          await expect(guard.method(guardRequest, h)).rejects.toMatchObject({ output: { statusCode: 404 } })
        })
      })

      describe('and the request is a POST', () => {
        test('it returns a 404', async () => {
          const guard = postBusinessCompanyRegistrationNumberChange.options.pre.at(-1)

          await expect(guard.method(guardRequest, h)).rejects.toMatchObject({ output: { statusCode: 404 } })
        })
      })
    })
  })

  describe('POST /business-company-registration-number-change', () => {
    describe('when a request succeeds', () => {
      beforeEach(() => {
        request.payload = { companyRegistrationNumber: '12345678' }

        fetchBusinessChangeService.mockResolvedValue({ ...getMockData(), changeBusinessCompanyRegistrationNumber: request.payload })
      })

      test('should have the correct method, path and auth scope configured', () => {
        expect(postBusinessCompanyRegistrationNumberChange.method).toBe('POST')
        expect(postBusinessCompanyRegistrationNumberChange.path).toBe('/business-company-registration-number-change')
        expect(postBusinessCompanyRegistrationNumberChange.options.auth.scope).toBe(FULL_PERMISSIONS)
      })

      describe('and the validation passes', () => {
        test('it redirects to the /business-company-registration-number-check page', async () => {
          await postBusinessCompanyRegistrationNumberChange.options.handler(request, h)

          expect(h.redirect).toHaveBeenCalledWith('/business-company-registration-number-check')
        })

        test('sets the payload on the yar state', async () => {
          await postBusinessCompanyRegistrationNumberChange.options.handler(request, h)

          expect(setSessionData).toHaveBeenCalledWith(
            request.yar,
            'businessDetailsUpdate',
            'changeBusinessCompanyRegistrationNumber',
            request.payload.companyRegistrationNumber
          )
        })
      })

      describe('and the validation fails', () => {
        let err

        beforeEach(() => {
          err = {
            details: [
              {
                message: 'Enter the company registration number',
                path: ['companyRegistrationNumber'],
                type: 'any.required'
              }
            ]
          }
        })

        test('it fetches the business details', async () => {
          await postBusinessCompanyRegistrationNumberChange.options.validate.failAction(request, h, err)

          expect(fetchBusinessChangeService).toHaveBeenCalledWith(
            request.yar,
            request.auth.credentials,
            'changeBusinessCompanyRegistrationNumber'
          )
        })

        test('it returns the page successfully with the error summary banner', async () => {
          await postBusinessCompanyRegistrationNumberChange.options.validate.failAction(request, h, err)

          expect(h.view).toHaveBeenCalledWith('business/business-company-registration-number-change', getPageDataError())
        })

        test('it should handle undefined errors', async () => {
          await postBusinessCompanyRegistrationNumberChange.options.validate.failAction(request, h, [])

          const pageData = getPageDataError()
          pageData.errors = {}

          expect(h.view).toHaveBeenCalledWith('business/business-company-registration-number-change', pageData)
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
      companiesHouse: '12345678',
      charityCommission: null
    },
    customer: {
      userName: 'Alfred Waldron'
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Enter the company registration number',
    metaDescription: 'Update the company registration number for your business.',
    businessName: 'Agile Farm Ltd',
    sbi: '800000001',
    userName: 'Alfred Waldron',
    companyRegistrationNumber: '12345678'
  }
}

const getPageDataError = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Enter the company registration number',
    metaDescription: 'Update the company registration number for your business.',
    businessName: 'Agile Farm Ltd',
    sbi: '800000001',
    userName: 'Alfred Waldron',
    companyRegistrationNumber: '12345678',
    errors: {
      companyRegistrationNumber: {
        text: 'Enter the company registration number'
      }
    }
  }
}
