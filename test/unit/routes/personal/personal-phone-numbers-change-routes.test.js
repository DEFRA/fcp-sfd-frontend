// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'

// Thing under test
import { personalPhoneNumbersChangeRoutes } from '../../../../src/routes/personal/personal-phone-numbers-change-routes.js'
const [getPersonalPhoneNumbersChange, postPersonalPhoneNumbersChange] = personalPhoneNumbersChangeRoutes

// Mocks
vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

vi.mock('../../../../src/services/personal/fetch-personal-change-service.js', () => ({
  fetchPersonalChangeService: vi.fn()
}))

describe('personal phone numbers change', () => {
  let h
  let request

  const credentials = {
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

  describe('GET /personal-phone-numbers-change', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchPersonalChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method and path', () => {
        expect(getPersonalPhoneNumbersChange.method).toBe('GET')
        expect(getPersonalPhoneNumbersChange.path).toBe('/account-phone-numbers-change')
      })

      test('it fetches the data from the session', async () => {
        await getPersonalPhoneNumbersChange.handler(request, h)

        expect(fetchPersonalChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changePersonalPhoneNumbers')
      })

      test('should render personal-phone-numbers-change view with page data', async () => {
        await getPersonalPhoneNumbersChange.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('personal/personal-phone-numbers-change', getPageData())
      })
    })
  })

  describe('POST /personal-phone-numbers-change', () => {
    beforeEach(() => {
      request.payload = { personalMobile: null, personalTelephone: null }

      fetchPersonalChangeService.mockResolvedValue({ ...getMockData(), changePersonalPhoneNumbers: request.payload })
    })

    describe('when a request succeeds', () => {
      describe('and the validation passes', () => {
        test('it sets the session data and redirects', async () => {
          await postPersonalPhoneNumbersChange.options.handler(request, h)

          expect(setSessionData).toHaveBeenCalledWith(
            request.yar,
            'personalDetails',
            'changePersonalPhoneNumbers',
            request.payload
          )
          expect(h.redirect).toHaveBeenCalledWith('/account-phone-numbers-check')
        })
      })

      describe('and the validation fails', () => {
        let err

        beforeEach(() => {
          err = {
            details: [
              {
                message: 'Personal telephone number must be 10 characters or more',
                path: ['personalTelephone'],
                type: 'string.min'
              }
            ]
          }
        })

        test('it fetches the personal details', async () => {
          await postPersonalPhoneNumbersChange.options.validate.failAction(request, h, err)

          expect(fetchPersonalChangeService).toHaveBeenCalledWith(
            request.yar,
            request.auth.credentials,
            'changePersonalPhoneNumbers'
          )
        })

        test('it returns the page successfully with the error summary banner', async () => {
          await postPersonalPhoneNumbersChange.options.validate.failAction(request, h, err)

          expect(h.view).toHaveBeenCalledWith('personal/personal-phone-numbers-change', getPageDataError())
        })

        test('it should handle undefined errors', async () => {
          await postPersonalPhoneNumbersChange.options.validate.failAction(request, h, [])

          const pageData = getPageDataError()
          pageData.errors = {}

          expect(h.view).toHaveBeenCalledWith('personal/personal-phone-numbers-change', pageData)
        })
      })
    })
  })
})

const getMockData = () => {
  return {
    info: {
      sbi: '123456789',
      businessName: 'Agile Farm Ltd',
      fullName: {
        fullNameJoined: 'Alfred Waldron'
      }
    },
    contact: {
      telephone: '01234 567891',
      mobile: null
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What are your personal phone numbers?',
    metaDescription: 'Update the phone numbers for your personal account.',
    userName: 'Alfred Waldron',
    personalMobile: null,
    personalTelephone: '01234 567891'
  }
}

const getPageDataError = () => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What are your personal phone numbers?',
    metaDescription: 'Update the phone numbers for your personal account.',
    userName: 'Alfred Waldron',
    personalMobile: null,
    personalTelephone: null,
    errors: {
      personalTelephone: {
        text: 'Personal telephone number must be 10 characters or more'
      }
    }
  }
}
