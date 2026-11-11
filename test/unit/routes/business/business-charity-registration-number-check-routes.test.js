// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'
import { updateBusinessCharityRegistrationNumberChangeService } from '../../../../src/services/business/update-business-charity-registration-number-change-service.js'

// Test helpers
import { LEGAL_PERMISSIONS } from '../../../../src/constants/scope/business-details.js'

// Thing under test
import { businessCharityRegistrationNumberCheckRoutes } from '../../../../src/routes/business/business-charity-registration-number-check-routes.js'
const [getBusinessCharityRegistrationNumberCheck, postBusinessCharityRegistrationNumberCheck] = businessCharityRegistrationNumberCheckRoutes

// Mocks
vi.mock('../../../../src/services/business/fetch-business-change-service.js', () => ({
  fetchBusinessChangeService: vi.fn()
}))

vi.mock('../../../../src/services/business/update-business-charity-registration-number-change-service.js', () => ({
  updateBusinessCharityRegistrationNumberChangeService: vi.fn()
}))

describe('business charity commission registration number check', () => {
  const request = {
    yar: { get: vi.fn() },
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
    request.yar.get.mockReturnValue('102101')
  })

  describe('GET /business-charity-registration-number-check', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        fetchBusinessChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method, path and auth scope configured', () => {
        expect(getBusinessCharityRegistrationNumberCheck.method).toBe('GET')
        expect(getBusinessCharityRegistrationNumberCheck.path).toBe('/business-charity-registration-number-check')
        expect(getBusinessCharityRegistrationNumberCheck.options.auth.scope).toBe(LEGAL_PERMISSIONS)
      })

      test('should have a pre-handler to guard against missing session data', () => {
        expect(getBusinessCharityRegistrationNumberCheck.options.pre).toHaveLength(1)
      })

      describe('pre-handler execution', () => {
        test('should redirect to /business-details when session data is missing', async () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({}) } }
          const redirectStub = {}
          const preHandler = getBusinessCharityRegistrationNumberCheck.options.pre[0]
          const preResponse = await preHandler.method(sessionRequest, {
            redirect: vi.fn().mockReturnValue({ takeover: vi.fn().mockReturnValue(redirectStub) })
          })

          expect(preResponse).toBe(redirectStub)
        })

        test('should allow access when required session field exists', async () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({ changeBusinessCharityRegistrationNumber: '12345678' }) } }
          const preHandler = getBusinessCharityRegistrationNumberCheck.options.pre[0]
          const preResponse = await preHandler.method(sessionRequest, { continue: {} })

          expect(preResponse).toBe(true)
        })
      })

      test('it fetches the data from the session', async () => {
        await getBusinessCharityRegistrationNumberCheck.handler(request, h)

        expect(fetchBusinessChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changeBusinessCharityRegistrationNumber')
      })

      test('should render business-charity-registration-number-check view with page data', async () => {
        await getBusinessCharityRegistrationNumberCheck.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-charity-registration-number-check', getPageData())
      })
    })
  })

  describe('legal status check', () => {
    beforeEach(() => {
      h = {
        redirect: vi.fn(),
        view: vi.fn().mockReturnValue({})
      }

      fetchBusinessChangeService.mockReturnValue(getMockData())
    })

    describe('when the business has a charity legal status', () => {
      beforeEach(() => {
        request.yar.get.mockReturnValue('102101')
      })

      describe('and the request is a GET', () => {
        test('it renders the page', async () => {
          await getBusinessCharityRegistrationNumberCheck.handler(request, h)

          expect(h.redirect).not.toHaveBeenCalled()
          expect(h.view).toHaveBeenCalled()
        })
      })

      describe('and the request is a POST', () => {
        test('it saves the change', async () => {
          await postBusinessCharityRegistrationNumberCheck.handler(request, h)

          expect(updateBusinessCharityRegistrationNumberChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials)
        })
      })
    })

    describe('when the business has a charity legal status stored as a number', () => {
      beforeEach(() => {
        request.yar.get.mockReturnValue(102101)
      })

      test('it renders the page', async () => {
        await getBusinessCharityRegistrationNumberCheck.handler(request, h)

        expect(h.redirect).not.toHaveBeenCalled()
        expect(h.view).toHaveBeenCalled()
      })
    })

    describe('when the business does not have a charity legal status', () => {
      beforeEach(() => {
        request.yar.get.mockReturnValue('102102')
      })

      describe('and the request is a GET', () => {
        test('it redirects to the business details page', async () => {
          await getBusinessCharityRegistrationNumberCheck.handler(request, h)

          expect(h.redirect).toHaveBeenCalledWith('/business-details')
          expect(fetchBusinessChangeService).not.toHaveBeenCalled()
        })
      })

      describe('and the request is a POST', () => {
        test('it redirects to the business details page without saving the change', async () => {
          await postBusinessCharityRegistrationNumberCheck.handler(request, h)

          expect(h.redirect).toHaveBeenCalledWith('/business-details')
          expect(updateBusinessCharityRegistrationNumberChangeService).not.toHaveBeenCalled()
        })
      })
    })

    describe('when the legal status code is not in the session', () => {
      beforeEach(() => {
        request.yar.get.mockReturnValue(undefined)
      })

      describe('and the request is a GET', () => {
        test('it redirects to the business details page', async () => {
          await getBusinessCharityRegistrationNumberCheck.handler(request, h)

          expect(h.redirect).toHaveBeenCalledWith('/business-details')
          expect(fetchBusinessChangeService).not.toHaveBeenCalled()
        })
      })

      describe('and the request is a POST', () => {
        test('it redirects to the business details page without saving the change', async () => {
          await postBusinessCharityRegistrationNumberCheck.handler(request, h)

          expect(h.redirect).toHaveBeenCalledWith('/business-details')
          expect(updateBusinessCharityRegistrationNumberChangeService).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe('POST /business-charity-registration-number-check', () => {
    beforeEach(() => {
      h = {
        redirect: vi.fn(() => h)
      }
    })

    describe('when a request succeeds', () => {
      test('should have the correct method, path and auth scope configured', () => {
        expect(postBusinessCharityRegistrationNumberCheck.method).toBe('POST')
        expect(postBusinessCharityRegistrationNumberCheck.path).toBe('/business-charity-registration-number-check')
        expect(postBusinessCharityRegistrationNumberCheck.options.auth.scope).toBe(LEGAL_PERMISSIONS)
      })

      test('should have a pre-handler to guard against missing session data', () => {
        expect(postBusinessCharityRegistrationNumberCheck.options.pre).toHaveLength(1)
      })

      test('it redirects to the /business-details page', async () => {
        await postBusinessCharityRegistrationNumberCheck.handler(request, h)

        expect(h.redirect).toHaveBeenCalledWith('/business-details')
      })

      test('calls updateBusinessCharityRegistrationNumberChangeService with yar and credentials', async () => {
        await postBusinessCharityRegistrationNumberCheck.handler(request, h)

        expect(updateBusinessCharityRegistrationNumberChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials)
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
    backLink: { href: '/business-charity-registration-number-change' },
    changeLink: '/business-charity-registration-number-change',
    pageTitle: 'Check your charity commission registration number is correct before submitting',
    metaDescription: 'Check the charity commission registration number for your business is correct.',
    businessName: 'Agile Farm Ltd',
    sbi: '800000001',
    userName: 'Alfred Waldron',
    charityCommissionRegistrationNumber: '12345678'
  }
}
