// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'
import { updateBusinessCompanyRegistrationNumberChangeService } from '../../../../src/services/business/update-business-company-registration-number-change-service.js'

// Test helpers
import { FULL_PERMISSIONS } from '../../../../src/constants/scope/business-details.js'

// Thing under test
import { businessCompanyRegistrationNumberCheckRoutes } from '../../../../src/routes/business/business-company-registration-number-check-routes.js'
const [getBusinessCompanyRegistrationNumberCheck, postBusinessCompanyRegistrationNumberCheck] = businessCompanyRegistrationNumberCheckRoutes

// Mocks
vi.mock('../../../../src/services/business/fetch-business-change-service.js', () => ({
  fetchBusinessChangeService: vi.fn()
}))

vi.mock('../../../../src/services/business/update-business-company-registration-number-change-service.js', () => ({
  updateBusinessCompanyRegistrationNumberChangeService: vi.fn()
}))

describe('business company registration number check', () => {
  const request = {
    yar: {},
    auth: {
      credentials: {
        sbi: '800000001',
        crn: '9000000001',
        email: 'test@example.com'
      }
    }
  }

  let h

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /business-company-registration-number-check', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        fetchBusinessChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method, path and auth scope configured', () => {
        expect(getBusinessCompanyRegistrationNumberCheck.method).toBe('GET')
        expect(getBusinessCompanyRegistrationNumberCheck.path).toBe('/business-company-registration-number-check')
        expect(getBusinessCompanyRegistrationNumberCheck.options.auth.scope).toBe(FULL_PERMISSIONS)
      })

      test('should have a pre-handler to guard against missing session data', () => {
        expect(getBusinessCompanyRegistrationNumberCheck.options.pre).toHaveLength(1)
      })

      describe('pre-handler execution', () => {
        test('should redirect to /business-details when session data is missing', async () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({}) } }
          const redirectStub = {}
          const preHandler = getBusinessCompanyRegistrationNumberCheck.options.pre[0]
          const preResponse = await preHandler.method(sessionRequest, {
            redirect: vi.fn().mockReturnValue({ takeover: vi.fn().mockReturnValue(redirectStub) })
          })

          expect(preResponse).toBe(redirectStub)
        })

        test('should allow access when required session field exists', async () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({ changeBusinessCompanyRegistrationNumber: '12345678' }) } }
          const preHandler = getBusinessCompanyRegistrationNumberCheck.options.pre[0]
          const preResponse = await preHandler.method(sessionRequest, { continue: {} })

          expect(preResponse).toBe(true)
        })
      })

      test('it fetches the data from the session', async () => {
        await getBusinessCompanyRegistrationNumberCheck.handler(request, h)

        expect(fetchBusinessChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changeBusinessCompanyRegistrationNumber')
      })

      test('should render business-company-registration-number-check view with page data', async () => {
        await getBusinessCompanyRegistrationNumberCheck.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-company-registration-number-check', getPageData())
      })
    })
  })

  describe('POST /business-company-registration-number-check', () => {
    beforeEach(() => {
      h = {
        redirect: vi.fn(() => h)
      }
    })

    describe('when a request succeeds', () => {
      test('should have the correct method, path and auth scope configured', () => {
        expect(postBusinessCompanyRegistrationNumberCheck.method).toBe('POST')
        expect(postBusinessCompanyRegistrationNumberCheck.path).toBe('/business-company-registration-number-check')
        expect(postBusinessCompanyRegistrationNumberCheck.options.auth.scope).toBe(FULL_PERMISSIONS)
      })

      test('should have a pre-handler to guard against missing session data', () => {
        expect(postBusinessCompanyRegistrationNumberCheck.options.pre).toHaveLength(1)
      })

      test('it redirects to the /business-details page', async () => {
        await postBusinessCompanyRegistrationNumberCheck.handler(request, h)

        expect(h.redirect).toHaveBeenCalledWith('/business-details')
      })

      test('calls updateBusinessCompanyRegistrationNumberChangeService with yar and credentials', async () => {
        await postBusinessCompanyRegistrationNumberCheck.handler(request, h)

        expect(updateBusinessCompanyRegistrationNumberChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials)
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
    backLink: { href: '/business-company-registration-number-change' },
    changeLink: '/business-company-registration-number-change',
    pageTitle: 'Check your company registration number is correct before submitting',
    metaDescription: 'Check the company registration number for your business is correct.',
    businessName: 'Agile Farm Ltd',
    sbi: '800000001',
    userName: 'Alfred Waldron',
    companyRegistrationNumber: '12345678'
  }
}
