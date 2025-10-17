// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'

// Thing under test
import { personalAddressSelectRoutes } from '../../../../src/routes/personal/personal-address-select-routes.js'
const [getPersonalAddressSelect, postPersonalAddressSelect] = personalAddressSelectRoutes

// Mocks
vi.mock('../../../../src/services/personal/fetch-personal-change-service.js', () => ({
  fetchPersonalChangeService: vi.fn()
}))

vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

describe('personal address select routes', () => {
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

  describe('GET /account-address-select', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchPersonalChangeService.mockResolvedValue(getMockData())
      })

      test('should have the correct method and path', () => {
        expect(getPersonalAddressSelect.method).toBe('GET')
        expect(getPersonalAddressSelect.path).toBe('/account-address-select')
      })

      test('it calls fetchPersonalChangeService', async () => {
        await getPersonalAddressSelect.handler(request, h)

        expect(fetchPersonalChangeService).toHaveBeenCalledWith(
          request.yar,
          request.auth.credentials,
          ['changePersonalPostcode', 'changePersonalAddresses', 'changePersonalAddress']
        )
      })

      test('should render personal-address-select view with page data', async () => {
        await getPersonalAddressSelect.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('personal/personal-address-select', getPageData())
      })
    })
  })

  describe('POST /account-address-select', () => {
    beforeEach(() => {
      request.payload = {
        addresses: '1001123 Test Street, LONDON, E1 6AN'
      }

      fetchPersonalChangeService.mockResolvedValue(getMockData())
    })

    describe('when a request succeeds', () => {
      describe('and the validation passes', () => {
        test('it sets the selected address in session and redirects', async () => {
          await postPersonalAddressSelect.options.handler(request, h)

          expect(setSessionData).toHaveBeenCalledWith(
            request.yar,
            'personalDetails',
            'changePersonalAddress',
            {
              displayAddress: '123 Test Street, LONDON, E1 6AN',
              postcodeLookup: true,
              uprn: '1001'
            }
          )
          expect(h.redirect).toHaveBeenCalledWith('/account-address-check')
        })
      })
    })

    describe('when validation fails', () => {
      let err

      beforeEach(() => {
        err = {
          details: [
            {
              message: 'Choose an address',
              path: ['addresses'],
              type: 'any.required'
            }
          ]
        }
      })

      test('it fetches the personal details', async () => {
        await postPersonalAddressSelect.options.validate.failAction(request, h, err)

        expect(fetchPersonalChangeService).toHaveBeenCalledWith(
          request.yar,
          request.auth.credentials,
          ['changePersonalPostcode', 'changePersonalAddresses']
        )
      })

      test('it returns the page successfully with the error summary banner', async () => {
        await postPersonalAddressSelect.options.validate.failAction(request, h, err)

        expect(h.view).toHaveBeenCalledWith('personal/personal-address-select', getPageDataError())
      })

      test('it should handle undefined errors', async () => {
        await postPersonalAddressSelect.options.validate.failAction(request, h, [])

        const pageData = getPageDataError()
        pageData.errors = {}

        expect(h.view).toHaveBeenCalledWith('personal/personal-address-select', pageData)
      })
    })
  })
})

const getMockData = () => {
  return {
    info: {
      fullName: {
        fullNameJoined: 'Alfred Waldron'
      }
    },
    changePersonalPostcode: {
      postcode: 'SK22 1DL'
    },
    changePersonalAddresses: [
      {
        displayAddress: '123 Test Street, LONDON, E1 6AN',
        uprn: '1001'
      }
    ]
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/account-address-change' },
    pageTitle: 'Choose your personal address',
    metaDescription: 'Choose the address for your personal account.',
    userName: 'Alfred Waldron',
    postcode: 'SK22 1DL',
    displayAddresses: [
      {
        value: 'display',
        text: '1 address found',
        selected: true
      },
      {
        value: '1001123 Test Street, LONDON, E1 6AN',
        text: '123 Test Street, LONDON, E1 6AN',
        selected: false
      }
    ]
  }
}

const getPageDataError = () => {
  return {
    backLink: { href: '/account-address-change' },
    pageTitle: 'Choose your personal address',
    metaDescription: 'Choose the address for your personal account.',
    userName: 'Alfred Waldron',
    postcode: 'SK22 1DL',
    displayAddresses: [
      {
        value: 'display',
        text: '1 address found',
        selected: true
      },
      {
        value: '1001123 Test Street, LONDON, E1 6AN',
        text: '123 Test Street, LONDON, E1 6AN',
        selected: false
      }
    ],
    errors: {
      addresses: {
        text: 'Choose an address'
      }
    }
  }
}
