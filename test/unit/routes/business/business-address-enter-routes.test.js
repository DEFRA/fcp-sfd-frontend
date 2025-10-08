// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'

// Thing under test
import { businessAddressEnterRoutes } from '../../../../src/routes/business/business-address-enter-routes.js'
const [getBusinessAddressEnter, postBusinessAddressEnter] = businessAddressEnterRoutes

// Mocks
vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

vi.mock('../../../../src/services/business/fetch-business-change-service.js', () => ({
  fetchBusinessChangeService: vi.fn()
}))

describe('business address enter', () => {
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

  describe('GET /business-address-enter', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchBusinessChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method and path', () => {
        expect(getBusinessAddressEnter.method).toBe('GET')
        expect(getBusinessAddressEnter.path).toBe('/business-address-enter')
      })

      test('it calls fetchBusinessChangeService', async () => {
        await getBusinessAddressEnter.handler(request, h)

        expect(fetchBusinessChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changeBusinessAddress')
      })

      test('should render business-address-enter view with page data', async () => {
        await getBusinessAddressEnter.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-address-enter', getPageData())
      })
    })
  })

  describe('POST /business-address-enter', () => {
    beforeEach(() => {
      request.payload = {
        address1: 'New address 1',
        address2: '',
        address3: '',
        city: 'Sandford',
        county: '',
        postcode: 'SK22 1DL',
        country: 'United Kingdom'
      }

      fetchBusinessChangeService.mockResolvedValue({ ...getMockData(), changeBusinessAddress: request.payload })
    })

    describe('when a request succeeds', () => {
      describe('and the validation passes', () => {
        test('it sets the session data and redirects', async () => {
          await postBusinessAddressEnter.options.handler(request, h)

          expect(setSessionData).toHaveBeenCalledWith(
            request.yar,
            'businessDetails',
            'changeBusinessAddress',
            request.payload
          )
          expect(h.redirect).toHaveBeenCalledWith('/business-address-check')
        })
      })

      describe('and the validation fails', () => {
        let err

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

        test('it fetches the business details', async () => {
          await postBusinessAddressEnter.options.validate.failAction(request, h, err)

          expect(fetchBusinessChangeService).toHaveBeenCalledWith(
            request.yar,
            request.auth.credentials,
            'changeBusinessAddress'
          )
        })

        test('it returns the page successfully with the error summary banner', async () => {
          await postBusinessAddressEnter.options.validate.failAction(request, h, err)

          expect(h.view).toHaveBeenCalledWith('business/business-address-enter', getPageDataError())
        })

        test('it should handle undefined errors', async () => {
          await postBusinessAddressEnter.options.validate.failAction(request, h, [])

          const pageData = getPageDataError()
          pageData.errors = {}

          expect(h.view).toHaveBeenCalledWith('business/business-address-enter', pageData)
        })
      })
    })
  })
})

const getMockData = () => {
  return {
    address: {
      lookup: {},
      manual: {
        line1: '10 Skirbeck Way',
        line2: '',
        line3: '',
        line4: 'Maidstone',
        line5: ''
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
      fullName: 'Alfred Waldron'
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/business-address-change' },
    pageTitle: 'Enter your business address',
    metaDescription: 'Enter the address for your business.',
    address: {
      address1: '10 Skirbeck Way',
      address2: '',
      address3: '',
      city: 'Maidstone',
      county: '',
      postcode: 'SK22 1DL',
      country: 'United Kingdom'
    },
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron'
  }
}

const getPageDataError = () => {
  return {
    backLink: { href: '/business-address-change' },
    pageTitle: 'Enter your business address',
    metaDescription: 'Enter the address for your business.',
    address: {
      address1: 'New address 1',
      address2: '',
      address3: '',
      city: 'Sandford',
      county: '',
      postcode: 'SK22 1DL',
      country: 'United Kingdom'
    },
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron',
    errors: {
      postcode: {
        text: 'Postal code or zip code must be 10 characters or less'
      }
    }
  }
}
