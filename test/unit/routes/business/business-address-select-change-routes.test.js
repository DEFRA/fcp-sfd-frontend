// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'

// Thing under test
import { businessAddressSelectChangeRoutes } from '../../../../src/routes/business/business-address-select-change.routes.js'
const [getBusinessAddressSelectChange, postBusinessAddressSelectChange] = businessAddressSelectChangeRoutes

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

  describe('GET /business-address-select-change', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchBusinessChangeService.mockResolvedValue(getMockData())
      })

      test('should have the correct method and path', () => {
        expect(getBusinessAddressSelectChange.method).toBe('GET')
        expect(getBusinessAddressSelectChange.path).toBe('/business-address-select-change')
      })

      test('it calls fetchBusinessChangeService', async () => {
        await getBusinessAddressSelectChange.handler(request, h)

        expect(fetchBusinessChangeService).toHaveBeenCalledWith(
          request.yar,
          request.auth.credentials,
          ['changeBusinessPostcode', 'changeBusinessAddresses']
        )
      })

      test('should render business-address-select-change view with page data', async () => {
        await getBusinessAddressSelectChange.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-address-select-change', getPageData())
      })
    })
  })

  describe('POST /business-address-select-change', () => {
    beforeEach(() => {
      request.payload = {
        addresses: '1001123 Test Street, LONDON, E1 6AN'
      }

      fetchBusinessChangeService.mockResolvedValue(getMockData())
    })

    describe('when a request succeeds', () => {
      describe('and the validation passes', () => {
        test('it sets the selected address in session and redirects', async () => {
          await postBusinessAddressSelectChange.options.handler(request, h)

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
        await postBusinessAddressSelectChange.options.validate.failAction(request, h, err)

        expect(fetchBusinessChangeService).toHaveBeenCalledWith(
          request.yar,
          request.auth.credentials,
          ['changeBusinessPostcode', 'changeBusinessAddresses']
        )
      })

      test('it returns the page successfully with the error summary banner', async () => {
        await postBusinessAddressSelectChange.options.validate.failAction(request, h, err)

        expect(h.view).toHaveBeenCalledWith('business/business-address-select-change', getPageDataError())
      })

      test('it should handle undefined errors', async () => {
        await postBusinessAddressSelectChange.options.validate.failAction(request, h, [])

        const pageData = getPageDataError()
        pageData.errors = {}

        expect(h.view).toHaveBeenCalledWith('business/business-address-select-change', pageData)
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
      fullName: 'Alfred Waldron'
    },
    changeBusinessPostcode: {
      businessPostcode: 'SK22 1DL'
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
