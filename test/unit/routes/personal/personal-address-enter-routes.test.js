// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'

// Thing under test
import { personalAddressEnterRoutes } from '../../../../src/routes/personal/personal-address-enter-routes.js'
const [getPersonalAddressEnter, postPersonalAddressEnter] = personalAddressEnterRoutes

// Mocks
vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

vi.mock('../../../../src/services/personal/fetch-personal-change-service.js', () => ({
  fetchPersonalChangeService: vi.fn()
}))

describe('personal address enter', () => {
  let request
  let h

  const credentials = {
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

  describe('GET /account-address-enter', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchPersonalChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method and path', () => {
        expect(getPersonalAddressEnter.method).toBe('GET')
        expect(getPersonalAddressEnter.path).toBe('/account-address-enter')
      })

      test('it calls fetchPersonalChangeService', async () => {
        await getPersonalAddressEnter.handler(request, h)

        expect(fetchPersonalChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changePersonalAddress')
      })

      test('should render personal-address-enter view with page data', async () => {
        await getPersonalAddressEnter.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('personal/personal-address-enter', getPageData())
      })
    })
  })

  describe('POST /account-address-enter', () => {
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

      fetchPersonalChangeService.mockResolvedValue({ ...getMockData(), changePersonalAddress: request.payload })
    })

    describe('when a request succeeds', () => {
      describe('and the validation passes', () => {
        test('it sets the session data and redirects', async () => {
          await postPersonalAddressEnter.options.handler(request, h)

          expect(setSessionData).toHaveBeenCalledWith(
            request.yar,
            'personalDetails',
            'changePersonalAddress',
            request.payload
          )
          expect(h.redirect).toHaveBeenCalledWith('/account-address-check')
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

        test('it fetches the personal details', async () => {
          await postPersonalAddressEnter.options.validate.failAction(request, h, err)

          expect(fetchPersonalChangeService).toHaveBeenCalledWith(
            request.yar,
            request.auth.credentials,
            'changePersonalAddress'
          )
        })

        test('it returns the page successfully with the error summary banner', async () => {
          await postPersonalAddressEnter.options.validate.failAction(request, h, err)

          expect(h.view).toHaveBeenCalledWith('personal/personal-address-enter', getPageDataError())
        })

        test('it should handle undefined errors', async () => {
          await postPersonalAddressEnter.options.validate.failAction(request, h, [])

          const pageData = getPageDataError()
          pageData.errors = {}

          expect(h.view).toHaveBeenCalledWith('personal/personal-address-enter', pageData)
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
      fullName: {
        first: 'Alfred',
        last: 'Waldron'
      },
      userName: 'Alfred Waldron'
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/account-address-change' },
    pageTitle: 'Enter your personal address',
    metaDescription: 'Enter the address for your personal account.',
    address: {
      address1: '10 Skirbeck Way',
      address2: '',
      address3: '',
      city: 'Maidstone',
      county: '',
      postcode: 'SK22 1DL',
      country: 'United Kingdom'
    },
    userName: 'Alfred Waldron'
  }
}

const getPageDataError = () => {
  return {
    backLink: { href: '/account-address-change' },
    pageTitle: 'Enter your personal address',
    metaDescription: 'Enter the address for your personal account.',
    address: {
      address1: 'New address 1',
      address2: '',
      address3: '',
      city: 'Sandford',
      county: '',
      postcode: 'SK22 1DL',
      country: 'United Kingdom'
    },
    userName: 'Alfred Waldron',
    errors: {
      postcode: {
        text: 'Postal code or zip code must be 10 characters or less'
      }
    }
  }
}
