// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'
import { updatePersonalAddressChangeService } from '../../../../src/services/personal/update-personal-address-change-service.js'

// Thing under test
import { personalAddressCheckRoutes } from '../../../../src/routes/personal/personal-address-check-routes.js'
const [getPersonalAddressCheck, postPersonalAddressCheck] = personalAddressCheckRoutes

// Mocks
vi.mock('../../../../src/services/personal/fetch-personal-change-service.js', () => ({
  fetchPersonalChangeService: vi.fn()
}))

vi.mock('../../../../src/services/personal/update-personal-address-change-service.js', () => ({
  updatePersonalAddressChangeService: vi.fn()
}))

describe('personal address check', () => {
  const request = {
    yar: {},
    auth: {
      credentials: {
        crn: '987654321',
        email: 'test@example.com'
      }
    }
  }

  let h

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /account-address-check', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        fetchPersonalChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method and path configured', () => {
        expect(getPersonalAddressCheck.method).toBe('GET')
        expect(getPersonalAddressCheck.path).toBe('/account-address-check')
      })

      test('should have a pre-handler to guard against missing session data', () => {
        expect(getPersonalAddressCheck.options.pre).toHaveLength(1)
      })

      describe('pre-handler execution', () => {
        test('should redirect to /personal-details when session data is missing', async () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({}) } }
          const redirectStub = {}
          const preHandler = getPersonalAddressCheck.options.pre[0]
          const preResponse = await preHandler.method(sessionRequest, {
            redirect: vi.fn().mockReturnValue({ takeover: vi.fn().mockReturnValue(redirectStub) })
          })

          expect(preResponse).toBe(redirectStub)
        })

        test('should allow access when required session field exists', async () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({ changePersonalAddress: { postcode: 'SW1A 1AA' } }) } }
          const preHandler = getPersonalAddressCheck.options.pre[0]
          const preResponse = await preHandler.method(sessionRequest, { continue: {} })

          expect(preResponse).toBe(true)
        })
      })

      test('it fetches the data from the session', async () => {
        await getPersonalAddressCheck.handler(request, h)

        expect(fetchPersonalChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changePersonalAddress')
      })

      test('should render personal-address-check view with page data', async () => {
        await getPersonalAddressCheck.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('personal/personal-address-check', getPageData())
      })
    })
  })

  describe('POST /account-address-check', () => {
    beforeEach(() => {
      h = {
        redirect: vi.fn(() => h)
      }
    })

    describe('when a request succeeds', () => {
      test('should have the correct method and path configured', () => {
        expect(postPersonalAddressCheck.method).toBe('POST')
        expect(postPersonalAddressCheck.path).toBe('/account-address-check')
      })

      test('should have a pre-handler to guard against missing session data', () => {
        expect(postPersonalAddressCheck.options.pre).toHaveLength(1)
      })

      describe('pre-handler execution', () => {
        test('should redirect to /personal-details when session data is missing', async () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({}) } }
          const redirectStub = {}
          const preHandler = postPersonalAddressCheck.options.pre[0]
          const preResponse = await preHandler.method(sessionRequest, {
            redirect: vi.fn().mockReturnValue({ takeover: vi.fn().mockReturnValue(redirectStub) })
          })

          expect(preResponse).toBe(redirectStub)
        })

        test('should allow access when required session field exists', async () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({ changePersonalAddress: { postcode: 'SW1A 1AA' } }) } }
          const preHandler = postPersonalAddressCheck.options.pre[0]
          const preResponse = await preHandler.method(sessionRequest, { continue: {} })

          expect(preResponse).toBe(true)
        })
      })

      test('it redirects to the /personal-details page', async () => {
        await postPersonalAddressCheck.handler(request, h)

        expect(h.redirect).toHaveBeenCalledWith('/personal-details')
      })

      test('calls updatePersonalAddressChangeService with yar and credentials', async () => {
        await postPersonalAddressCheck.handler(request, h)

        expect(updatePersonalAddressChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials)
      })
    })
  })
})

const getMockData = () => {
  return {
    info: {
      userName: 'Alfred Waldron',
      fullName: {
        first: 'Alfred',
        last: 'Waldron'
      }
    },
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
    changePersonalAddress: {
      address1: '10 Skirbeck Way',
      city: 'Maidstone',
      postcode: 'SK22 1DL',
      country: 'United Kingdom'
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/account-address-enter' },
    changeLink: '/account-address-enter',
    pageTitle: 'Check your personal address is correct before submitting',
    metaDescription: 'Check the address for your personal account is correct.',
    address: [
      '10 Skirbeck Way',
      'Maidstone',
      'SK22 1DL',
      'United Kingdom'
    ],
    userName: 'Alfred Waldron'
  }
}
