// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'

// Test helpers
import { AMEND_PERMISSIONS } from '../../../../src/constants/scope/business-details.js'

// Thing under test
import { businessAddressSelectRoutes } from '../../../../src/routes/business/business-address-select.routes.js'
const [getBusinessAddressSelect, postBusinessAddressSelect] = businessAddressSelectRoutes

// Mocks
vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

vi.mock('../../../../src/services/business/fetch-business-change-service.js', () => ({
  fetchBusinessChangeService: vi.fn()
}))

describe('business address select change', () => {
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

  describe('GET /business-address-select', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchBusinessChangeService.mockResolvedValue(getMockData())
      })

      test('should have the correct method, path and auth scope configured', () => {
        expect(getBusinessAddressSelect.method).toBe('GET')
        expect(getBusinessAddressSelect.path).toBe('/business-address-select')
        expect(getBusinessAddressSelect.options.auth.scope).toBe(AMEND_PERMISSIONS)
      })

      test('it calls fetchBusinessChangeService', async () => {
        await getBusinessAddressSelect.handler(request, h)

        expect(fetchBusinessChangeService).toHaveBeenCalledWith(
          request.yar,
          request.auth.credentials,
          ['changeBusinessPostcode', 'changeBusinessAddresses', 'changeBusinessAddress']
        )
      })

      test('should render business-address-select view with page data', async () => {
        await getBusinessAddressSelect.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-address-select', getPageData())
      })
    })
  })

  describe('POST /business-address-select', () => {
    beforeEach(() => {
      request.payload = {
        addresses: '1001123 Test Street, LONDON, E1 6AN'
      }

      fetchBusinessChangeService.mockResolvedValue(getMockData())
    })

    describe('when a request succeeds', () => {
      test('should have the correct method, path and auth scope configured', () => {
        expect(postBusinessAddressSelect.method).toBe('POST')
        expect(postBusinessAddressSelect.path).toBe('/business-address-select')
        expect(postBusinessAddressSelect.options.auth.scope).toBe(AMEND_PERMISSIONS)
      })

      describe('and the validation passes', () => {
        test('it sets the selected address in session and redirects', async () => {
          await postBusinessAddressSelect.options.handler(request, h)

          expect(setSessionData).toHaveBeenCalledWith(
            request.yar,
            'businessDetails',
            'changeBusinessAddress',
            {
              displayAddress: '123 Test Street, LONDON, E1 6AN',
              postcodeLookup: true,
              uprn: '1001'
            }
          )
          expect(h.redirect).toHaveBeenCalledWith('/business-address-check')
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

      test('it fetches business details', async () => {
        await postBusinessAddressSelect.options.validate.failAction(request, h, err)

        expect(fetchBusinessChangeService).toHaveBeenCalledWith(
          request.yar,
          request.auth.credentials,
          ['changeBusinessPostcode', 'changeBusinessAddresses']
        )
      })

      test('it returns the page successfully with the error summary banner', async () => {
        await postBusinessAddressSelect.options.validate.failAction(request, h, err)

        expect(h.view).toHaveBeenCalledWith('business/business-address-select', getPageDataError())
      })

      test('it should handle undefined errors', async () => {
        await postBusinessAddressSelect.options.validate.failAction(request, h, [])

        const pageData = getPageDataError()
        pageData.errors = {}

        expect(h.view).toHaveBeenCalledWith('business/business-address-select', pageData)
      })
    })
  })
})

const getMockData = () => {
  return {
    info: {
      sbi: '123456789',
      businessName: 'Agile Farm Ltd'
    },
    customer: {
      userName: 'Alfred Waldron'
    },
    changeBusinessPostcode: {
      postcode: 'SK22 1DL'
    },
    changeBusinessAddresses: [
      {
        displayAddress: '123 Test Street, LONDON, E1 6AN',
        uprn: '1001'
      }
    ]
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/business-address-change' },
    pageTitle: 'Choose your business address',
    metaDescription: 'Choose the address for your business.',
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
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
    backLink: { href: '/business-address-change' },
    pageTitle: 'Choose your business address',
    metaDescription: 'Choose the address for your business.',
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
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
