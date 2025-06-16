// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchBusinessAddressService } from '../../../../src/services/business/fetch-business-address-service.js'
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'

// Thing under test
import { businessAddressRoutes } from '../../../../src/routes/business/business-address-enter-routes.js'
const [getBusinessAddressEnter, postBusinessAddressEnter] = businessAddressRoutes

// Mocks
vi.mock('../../../../src/services/business/fetch-business-address-service.js', () => ({
  fetchBusinessAddressService: vi.fn()
}))

vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

describe('business address enter', () => {
  let h
  let request = {}
  let mockData
  let err

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /business-address-enter', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        // Mock the yar object with a set method
        request.yar = {
          set: vi.fn()
        }

        mockData = getMockData()
        fetchBusinessAddressService.mockResolvedValue(mockData)
      })

      test('it calls the fetchBusinessAddressService', async () => {
        await getBusinessAddressEnter.handler(request, h)

        expect(fetchBusinessAddressService).toHaveBeenCalled(request)
        expect(h.view).toHaveBeenCalledWith('business/business-address-enter', getPageData())
      })

      test('it sets the fetched data on the yar state', async () => {
        await getBusinessAddressEnter.handler(request, h)

        expect(request.yar.set).toHaveBeenCalledWith('businessAddressEnterData', mockData)
      })
    })
  })

  describe('POST /business-address-enter', () => {
    beforeEach(() => {
      const responseStub = {
        code: vi.fn().mockReturnThis(),
        takeover: vi.fn().mockReturnThis()
      }

      h = {
        redirect: vi.fn(() => h),
        view: vi.fn(() => responseStub)
      }

      // Mock yar.set for session
      request.yar = {
        set: vi.fn(),
        get: vi.fn()
      }

      request.payload = getMockData()
      request.pre = { sessionData: request.payload }
    })

    describe('when a request succeeds', () => {
      test('sets the payload on the yar state', async () => {
        // Calling the pre method handler
        await postBusinessAddressEnter.options.pre[0].method(request, h)

        expect(setSessionData).toHaveBeenCalledWith(
          request.payload,
          request.yar,
          'businessAddressEnterData',
          'businessAddress'
        )
      })

      describe('and the validation passes', () => {
        test('it redirects to the /business-address-check page', async () => {
          // Calling the handler
          await postBusinessAddressEnter.options.handler(request, h)

          expect(h.redirect).toHaveBeenCalledWith('/business-address-check')
        })
      })

      describe('and the validation fails', () => {
        beforeEach(() => {
          err = {
            details: [
              {
                message: 'Postal code or zip code must be 10 characters or less',
                path: ['postcode'],
                type: 'string.max'
              }
            ]
          }
        })

        test('it returns the page successfully with the error summary banner', async () => {
          // Calling the fail action handler
          await postBusinessAddressEnter.options.validate.failAction(request, h, err)

          expect(h.view).toHaveBeenCalledWith('business/business-address-enter', getPageDataError())
        })
      })
    })
  })
})

const getMockData = () => {
  return {
    businessName: 'Agile Farm Ltd',
    businessAddress: {
      address1: '10 Skirbeck Way',
      address2: '',
      city: 'Maidstone',
      county: '',
      postcode: 'SK22 1DL',
      country: 'United Kingdom'
    },
    singleBusinessIdentifier: '123456789',
    userName: 'Alfred Waldron'
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Enter your business address',
    metaDescription: 'Enter the address for your business.',
    address: {
      address1: '10 Skirbeck Way',
      address2: '',
      city: 'Maidstone',
      county: '',
      postcode: 'SK22 1DL',
      country: 'United Kingdom'
    },
    businessName: 'Agile Farm Ltd',
    singleBusinessIdentifier: '123456789',
    userName: 'Alfred Waldron'
  }
}

const getPageDataError = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Enter your business address',
    metaDescription: 'Enter the address for your business.',
    address: {
      address1: '10 Skirbeck Way',
      address2: '',
      city: 'Maidstone',
      county: '',
      postcode: 'SK22 1DL',
      country: 'United Kingdom'
    },
    businessName: 'Agile Farm Ltd',
    singleBusinessIdentifier: '123456789',
    userName: 'Alfred Waldron',
    postcode: {
      text: 'Postal code or zip code must be 10 characters or less'
    }
  }
}
