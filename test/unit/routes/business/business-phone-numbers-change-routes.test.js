// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'

// Thing under test
import { businessPhoneNumbersChangeRoutes } from '../../../../src/routes/business/business-phone-numbers-change-routes.js'
const [getBusinessPhoneNumbersChange, postBusinessPhoneNumbersChange] = businessPhoneNumbersChangeRoutes

// Mocks
vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

vi.mock('../../../../src/services/business/fetch-business-change-service.js', () => ({
  fetchBusinessChangeService: vi.fn()
}))

describe('business phone numbers change', () => {
  let h
  let request

  const credentials = {
    sbi: '123456789',
    crn: '987654321',
    email: 'test@example.com'
  }

  beforeEach(() => {
    vi.clearAllMocks()

    request = {
      yar: {},
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

  describe('GET /business-phone-numbers-change', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchBusinessChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method and path', () => {
        expect(getBusinessPhoneNumbersChange.method).toBe('GET')
        expect(getBusinessPhoneNumbersChange.path).toBe('/business-phone-numbers-change')
      })

      test('it calls fetchBusinessChangeService', async () => {
        await getBusinessPhoneNumbersChange.handler(request, h)

        expect(fetchBusinessChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changeBusinessPhoneNumbers')
      })

      test('should render business-phone-numbers-change view with page data', async () => {
        await getBusinessPhoneNumbersChange.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-phone-numbers-change', getPageData())
      })
    })
  })

  describe('POST /business-phone-numbers-change', () => {
    beforeEach(() => {
      request.payload = { businessMobile: null, businessTelephone: null }

      fetchBusinessChangeService.mockResolvedValue({ ...getMockData(), changeBusinessName: request.payload })
    })

    describe('when a request succeeds', () => {
      describe('and the validation passes', () => {
        test('it sets the session data and redirects', async () => {
          await postBusinessPhoneNumbersChange.options.handler(request, h)

          expect(setSessionData).toHaveBeenCalledWith(
            request.yar,
            'businessDetails',
            'changeBusinessPhoneNumbers',
            request.payload
          )
          expect(h.redirect).toHaveBeenCalledWith('/business-phone-numbers-check')
        })
      })

      describe('and the validation fails', () => {
        let err

        beforeEach(() => {
          err = {
            details: [
              {
                message: 'Business mobile number must be 10 characters or more',
                path: ['businessMobile'],
                type: 'string.min'
              }
            ]
          }
        })

        test('it fetches the business details', async () => {
          await postBusinessPhoneNumbersChange.options.validate.failAction(request, h, err)

          expect(fetchBusinessChangeService).toHaveBeenCalledWith(
            request.yar,
            request.auth.credentials,
            'changeBusinessPhoneNumbers'
          )
        })

        test('it returns the page successfully with the error summary banner', async () => {
          await postBusinessPhoneNumbersChange.options.validate.failAction(request, h, err)

          expect(h.view).toHaveBeenCalledWith('business/business-phone-numbers-change', getPageDataError())
        })

        test('it should handle undefined errors', async () => {
          await postBusinessPhoneNumbersChange.options.validate.failAction(request, h, [])

          const pageData = getPageDataError()
          pageData.errors = {}

          expect(h.view).toHaveBeenCalledWith('business/business-phone-numbers-change', pageData)
        })
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
    contact: {
      mobile: '01234 567891',
      landline: '01111 111111'
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'What are your business phone numbers?',
    metaDescription: 'Update the phone numbers for your business.',
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron',
    businessTelephone: '01111 111111',
    businessMobile: '01234 567891'
  }
}

const getPageDataError = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'What are your business phone numbers?',
    metaDescription: 'Update the phone numbers for your business.',
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron',
    businessTelephone: null,
    businessMobile: null,
    errors: {
      businessMobile: {
        text: 'Business mobile number must be 10 characters or more'
      }
    }
  }
}
