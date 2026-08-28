// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'
import { updateBusinessAddressChangeService } from '../../../../src/services/business/update-business-address-change-service.js'

// Test helpers
import { AMEND_PERMISSIONS } from '../../../../src/constants/scope/business-details.js'

// Thing under test
import { businessAddressCheckRoutes } from '../../../../src/routes/business/business-address-check-routes.js'
const [getBusinessAddressCheck, postBusinessAddressCheck] = businessAddressCheckRoutes

// Mocks
vi.mock('../../../../src/services/business/fetch-business-change-service.js', () => ({
  fetchBusinessChangeService: vi.fn()
}))

vi.mock('../../../../src/services/business/update-business-address-change-service.js', () => ({
  updateBusinessAddressChangeService: vi.fn()
}))

describe('business address check', () => {
  const request = {
    yar: {},
    auth: {
      credentials: {
        sbi: '123456789',
        crn: '987654321',
        email: 'test@example.com'
      }
    }
  }

  let h

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /business-address-enter', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        fetchBusinessChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method, path and auth scope configured', () => {
        expect(getBusinessAddressCheck.method).toBe('GET')
        expect(getBusinessAddressCheck.path).toBe('/business-address-check')
        expect(getBusinessAddressCheck.options.auth.scope).toBe(AMEND_PERMISSIONS)
      })

      test('should have a pre-handler to guard against missing session data', () => {
        expect(getBusinessAddressCheck.options.pre).toHaveLength(1)
      })

      describe('pre-handler execution', () => {
        test('should have the pre-handler defined', () => {
          const preHandler = getBusinessAddressCheck.options.pre[0]

          expect(preHandler).toBeDefined()
          expect(preHandler.method).toBeDefined()
        })

        test('should redirect to /business-details when session data is missing', async () => {
          const redirectFn = vi.fn()
          const takeoverFn = vi.fn().mockReturnValue({})
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({}) } }
          const h = { redirect: redirectFn.mockReturnValue({ takeover: takeoverFn }) }

          const preHandler = getBusinessAddressCheck.options.pre[0]
          await preHandler.method(sessionRequest, h)

          expect(redirectFn).toHaveBeenCalledWith('/business-details')
          expect(takeoverFn).toHaveBeenCalled()
        })

        test('should check the correct session key (businessDetailsUpdate)', async () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({}) } }
          const h = { redirect: vi.fn().mockReturnValue({ takeover: vi.fn() }) }

          const preHandler = getBusinessAddressCheck.options.pre[0]
          await preHandler.method(sessionRequest, h)

          expect(sessionRequest.yar.get).toHaveBeenCalledWith('businessDetailsUpdate')
        })

        test('should allow access when required session field exists with valid data', async () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({ changeBusinessAddress: { postcode: 'SW1A 1AA' } }) } }
          const preHandler = getBusinessAddressCheck.options.pre[0]
          const preResponse = await preHandler.method(sessionRequest, {})

          expect(preResponse).toBe(true)
        })

        test('should allow access when session field has empty string (falsy but valid)', async () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({ changeBusinessAddress: '' }) } }
          const preHandler = getBusinessAddressCheck.options.pre[0]
          const preResponse = await preHandler.method(sessionRequest, {})

          expect(preResponse).toBe(true)
        })

        test('should allow access when session field has false (falsy but valid)', async () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({ changeBusinessAddress: false }) } }
          const preHandler = getBusinessAddressCheck.options.pre[0]
          const preResponse = await preHandler.method(sessionRequest, {})

          expect(preResponse).toBe(true)
        })

        test('should redirect when session data is null', async () => {
          const redirectFn = vi.fn()
          const takeoverFn = vi.fn().mockReturnValue({})
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue(null) } }
          const h = { redirect: redirectFn.mockReturnValue({ takeover: takeoverFn }) }

          const preHandler = getBusinessAddressCheck.options.pre[0]
          await preHandler.method(sessionRequest, h)

          expect(redirectFn).toHaveBeenCalledWith('/business-details')
        })
      })

      test('it fetches the data from the session', async () => {
        await getBusinessAddressCheck.handler(request, h)

        expect(fetchBusinessChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changeBusinessAddress')
      })

      test('should render business-address-check view with page data', async () => {
        await getBusinessAddressCheck.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-address-check', getPageData())
      })
    })
  })

  describe('POST /business-address-check', () => {
    beforeEach(() => {
      h = {
        redirect: vi.fn(() => h)
      }
    })

    describe('when a request succeeds', () => {
      test('should have the correct method, path and auth scope configured', () => {
        expect(postBusinessAddressCheck.method).toBe('POST')
        expect(postBusinessAddressCheck.path).toBe('/business-address-check')
        expect(postBusinessAddressCheck.options.auth.scope).toBe(AMEND_PERMISSIONS)
      })

      test('should have a pre-handler to guard against missing session data', () => {
        expect(postBusinessAddressCheck.options.pre).toHaveLength(1)
      })

      describe('pre-handler execution', () => {
        test('should have the pre-handler defined', () => {
          const preHandler = postBusinessAddressCheck.options.pre[0]
          expect(preHandler).toBeDefined()
          expect(preHandler.method).toBeDefined()
        })

        test('should redirect to /business-details when session data is missing', async () => {
          const redirectFn = vi.fn()
          const takeoverFn = vi.fn().mockReturnValue({})
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({}) } }
          const h = { redirect: redirectFn.mockReturnValue({ takeover: takeoverFn }) }

          const preHandler = postBusinessAddressCheck.options.pre[0]
          await preHandler.method(sessionRequest, h)

          expect(redirectFn).toHaveBeenCalledWith('/business-details')
          expect(takeoverFn).toHaveBeenCalled()
        })

        test('should check the correct session key (businessDetailsUpdate)', async () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({}) } }
          const h = { redirect: vi.fn().mockReturnValue({ takeover: vi.fn() }) }

          const preHandler = postBusinessAddressCheck.options.pre[0]
          await preHandler.method(sessionRequest, h)

          expect(sessionRequest.yar.get).toHaveBeenCalledWith('businessDetailsUpdate')
        })

        test('should allow access when required session field exists with valid data', async () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({ changeBusinessAddress: { postcode: 'SW1A 1AA' } }) } }
          const preHandler = postBusinessAddressCheck.options.pre[0]
          const preResponse = await preHandler.method(sessionRequest, {})

          expect(preResponse).toBe(true)
        })

        test('should allow access when session field has empty string (falsy but valid)', async () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({ changeBusinessAddress: '' }) } }
          const preHandler = postBusinessAddressCheck.options.pre[0]
          const preResponse = await preHandler.method(sessionRequest, {})

          expect(preResponse).toBe(true)
        })

        test('should allow access when session field has false (falsy but valid)', async () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({ changeBusinessAddress: false }) } }
          const preHandler = postBusinessAddressCheck.options.pre[0]
          const preResponse = await preHandler.method(sessionRequest, {})

          expect(preResponse).toBe(true)
        })

        test('should redirect when session data is null', async () => {
          const redirectFn = vi.fn()
          const takeoverFn = vi.fn().mockReturnValue({})
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue(null) } }
          const h = { redirect: redirectFn.mockReturnValue({ takeover: takeoverFn }) }

          const preHandler = postBusinessAddressCheck.options.pre[0]
          await preHandler.method(sessionRequest, h)

          expect(redirectFn).toHaveBeenCalledWith('/business-details')
        })
      })

      test('it redirects to the /business-details page', async () => {
        await postBusinessAddressCheck.handler(request, h)

        expect(h.redirect).toHaveBeenCalledWith('/business-details')
      })

      test('calls updateBusinessAddressChangeService with yar and credentials', async () => {
        await postBusinessAddressCheck.handler(request, h)

        expect(updateBusinessAddressChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials)
      })
    })
  })
})

const getMockData = () => {
  return {
    address: {
      lookup: {
        pafOrganisationName: null,
        buildingNumberRange: null,
        flatName: null,
        buildingName: null,
        dependentLocality: null,
        doubleDependentLocality: null,
        street: null,
        county: null,
        uprn: null
      },
      manual: {
        line1: '10 Skirbeck Way',
        line2: null,
        line3: null,
        line4: null,
        line5: null
      },
      city: 'Maidstone',
      postcode: 'SK22 1DL',
      country: 'United Kingdom'
    },
    info: {
      sbi: '123456789',
      businessName: 'Agile Farm Ltd'
    },
    customer: {
      userName: 'Alfred Waldron'
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/business-address-enter' },
    changeLink: '/business-address-enter',
    pageTitle: 'Check your business address is correct before submitting',
    metaDescription: 'Check the address for your business is correct.',
    address: [
      '10 Skirbeck Way',
      'Maidstone',
      'SK22 1DL',
      'United Kingdom'
    ],
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron'
  }
}
