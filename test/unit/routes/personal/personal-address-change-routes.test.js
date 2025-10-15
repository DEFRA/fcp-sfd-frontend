// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { addressLookupService } from '../../../../src/services/os-places/address-lookup-service.js'
import { personalAddressChangeErrorService } from '../../../../src/services/personal/personal-address-change-error-service.js'

// Thing under test
import { personalAddressChangeRoutes } from '../../../../src/routes/personal/personal-address-change-routes.js'
const [getPersonalAddressChange, postPersonalAddressChange] = personalAddressChangeRoutes

// Mocks
vi.mock('../../../../src/services/personal/fetch-personal-change-service.js', () => ({
  fetchPersonalChangeService: vi.fn()
}))

vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

vi.mock('../../../../src/services/os-places/address-lookup-service.js', () => ({
  addressLookupService: vi.fn()
}))

vi.mock('../../../../src/services/personal/personal-address-change-error-service.js', () => ({
  personalAddressChangeErrorService: vi.fn()
}))

describe('personal address change routes', () => {
  let request
  let h

  const credentials = {
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

  describe('GET /personal-address-change', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchPersonalChangeService.mockResolvedValue(getMockData())
      })

      test('should have the correct method and path', () => {
        expect(getPersonalAddressChange.method).toBe('GET')
        expect(getPersonalAddressChange.path).toBe('/account-address-change')
      })

      test('it calls fetchPersonalChangeService', async () => {
        await getPersonalAddressChange.handler(request, h)

        expect(fetchPersonalChangeService).toHaveBeenCalledWith(
          request.yar,
          request.auth.credentials,
          'changePersonalPostcode'
        )
      })

      test('should render personal-address-change view with page data', async () => {
        await getPersonalAddressChange.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('personal/personal-address-change', getPageData())
      })
    })
  })

  describe('POST /personal-address-change', () => {
    beforeEach(() => {
      request.payload = {
        postcode: 'SK22 1DL'
      }
    })

    describe('when a request succeeds', () => {
      describe('and the validation passes', () => {
        describe('and addresses are found for the postcode', () => {
          beforeEach(() => {
            addressLookupService.mockResolvedValue([{ address1: '10 High Street London SK22 1DL' }])
          })

          test('it sets session data', async () => {
            await postPersonalAddressChange.handler(request, h)

            expect(setSessionData).toHaveBeenCalledWith(
              request.yar,
              'personalDetails',
              'changePersonalPostcode',
              request.payload
            )
          })

          test('it redirects to /account-address-select if addresses found', async () => {
            await postPersonalAddressChange.handler(request, h)

            expect(h.redirect).toHaveBeenCalledWith('/account-address-select')
          })
        })

        describe('and no addresses are found for the postcode', () => {
          beforeEach(() => {
            addressLookupService.mockResolvedValue({ error: 'No addresses found for this postcode' })
            personalAddressChangeErrorService.mockResolvedValue(getPageDataError())
          })

          test('it returns the page successfully with the error summary banner', async () => {
            await postPersonalAddressChange.handler(request, h)

            expect(h.view).toHaveBeenCalledWith('personal/personal-address-change', getPageDataError())
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

          personalAddressChangeErrorService.mockResolvedValue(getPageDataError())
        })

        test('calls personalAddressChangeErrorService with the correct errors', async () => {
          await postPersonalAddressChange.options.validate.failAction(request, h, err)

          expect(personalAddressChangeErrorService).toHaveBeenCalledWith(
            request.yar,
            request.auth.credentials,
            request.payload.postcode,
            err.details
          )
        })

        test('it returns the page successfully with the error summary banner', async () => {
          await postPersonalAddressChange.handler(request, h)

          expect(h.view).toHaveBeenCalledWith('personal/personal-address-change', getPageDataError())
        })
      })
    })
  })
})

const getPageData = () => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What is your personal address?',
    metaDescription: 'Update the address for your personal account.',
    postcode: 'SK22 1DL',
    userName: 'Alfred Waldron'
  }
}

const getPageDataError = () => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What is your personal address?',
    metaDescription: 'Update the address for your personal account.',
    postcode: 'SK22 1DL',
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
      fullName: {
        fullNameJoined: 'Alfred Waldron'
      }
    }
  }
}
