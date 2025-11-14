// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { addressLookupService } from '../../../../src/services/os-places/address-lookup-service.js'
import { businessAddressChangeErrorService } from '../../../../src/services/business/business-address-change-error-service.js'

// Test helpers
import { AMEND_PERMISSIONS } from '../../../../src/constants/scope/business-details.js'

// Thing under test
import { businessAddressChangeRoutes } from '../../../../src/routes/business/business-address-change-routes.js'
const [getBusinessAddressChange, postBusinessAddressChange] = businessAddressChangeRoutes

// Mocks
vi.mock('../../../../src/services/business/fetch-business-change-service.js', () => ({
  fetchBusinessChangeService: vi.fn()
}))

vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

vi.mock('../../../../src/services/os-places/address-lookup-service.js', () => ({
  addressLookupService: vi.fn()
}))

vi.mock('../../../../src/services/business/business-address-change-error-service.js', () => ({
  businessAddressChangeErrorService: vi.fn()
}))

describe('business address change routes', () => {
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
      yar: { get: vi.fn(), set: vi.fn() },
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

  describe('GET /business-address-change', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchBusinessChangeService.mockResolvedValue(getMockData())
      })

      test('should have the correct method, path and auth scope configured', () => {
        expect(getBusinessAddressChange.method).toBe('GET')
        expect(getBusinessAddressChange.path).toBe('/business-address-change')
        expect(getBusinessAddressChange.options.auth.scope).toBe(AMEND_PERMISSIONS)
      })

      test('it calls fetchBusinessChangeService', async () => {
        await getBusinessAddressChange.handler(request, h)

        expect(fetchBusinessChangeService).toHaveBeenCalledWith(
          request.yar,
          request.auth.credentials,
          'changeBusinessPostcode'
        )
      })

      test('should render business-address-change view with page data', async () => {
        await getBusinessAddressChange.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-address-change', getPageData())
      })
    })
  })

  describe('POST /business-address-change', () => {
    beforeEach(() => {
      request.payload = {
        postcode: 'SK22 1DL'
      }
    })

    describe('when a request succeeds', () => {
      test('should have the correct method, path and auth scope configured', () => {
        expect(postBusinessAddressChange.method).toBe('POST')
        expect(postBusinessAddressChange.path).toBe('/business-address-change')
        expect(postBusinessAddressChange.options.auth.scope).toBe(AMEND_PERMISSIONS)
      })

      describe('and the validation passes', () => {
        describe('and addresses are found for the postcode', () => {
          beforeEach(() => {
            addressLookupService.mockResolvedValue([{ address1: '10 High Street London SK22 1DL' }])
          })

          test('it sets session data', async () => {
            await postBusinessAddressChange.handler(request, h)

            expect(setSessionData).toHaveBeenCalledWith(
              request.yar,
              'businessDetails',
              'changeBusinessPostcode',
              request.payload
            )
          })

          test('it redirects to /business-address-select if addresses found', async () => {
            await postBusinessAddressChange.handler(request, h)

            expect(h.redirect).toHaveBeenCalledWith('/business-address-select')
          })
        })

        describe('and no addresses are found for the postcode', () => {
          beforeEach(() => {
            addressLookupService.mockResolvedValue({ error: 'No addresses found for this postcode' })
            businessAddressChangeErrorService.mockResolvedValue(getPageDataError())
          })

          test('it returns the page successfully with the error summary banner', async () => {
            await postBusinessAddressChange.handler(request, h)

            expect(h.view).toHaveBeenCalledWith('business/business-address-change', getPageDataError())
          })
        })
      })

      describe('and the validation fails', () => {
        let err

        beforeEach(() => {
          err = {
            details: [
              {
                message: 'Invalid postcode',
                path: ['postcode'],
                type: 'string.pattern.base'
              }
            ]
          }

          businessAddressChangeErrorService.mockResolvedValue(getPageDataError())
        })

        test('calls businessAddressChangeErrorService with the correct errors', async () => {
          await postBusinessAddressChange.options.validate.failAction(request, h, err)

          expect(businessAddressChangeErrorService).toHaveBeenCalledWith(
            request.yar,
            request.auth.credentials,
            request.payload.postcode,
            err.details
          )
        })

        test('it returns the page successfully with the error summary banner', async () => {
          await postBusinessAddressChange.handler(request, h)

          expect(h.view).toHaveBeenCalledWith('business/business-address-change', getPageDataError())
        })
      })
    })
  })
})

const getPageData = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'What is your business address?',
    metaDescription: 'Update the address for your business.',
    postcode: 'SK22 1DL',
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron'
  }
}

const getPageDataError = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'What is your business address?',
    metaDescription: 'Update the address for your business.',
    postcode: 'SK22 1DL',
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron',
    errors: {
      text: 'No addresses found for this postcode'
    }
  }
}

const getMockData = () => {
  return {
    address: {
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
      userName: 'Alfred Waldron'
    }
  }
}
