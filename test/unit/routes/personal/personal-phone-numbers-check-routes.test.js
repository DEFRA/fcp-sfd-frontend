// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'
import { updatePersonalPhoneNumbersChangeService } from '../../../../src/services/personal/update-personal-phone-numbers-change-service.js'

// Thing under test
import { personalPhoneNumbersCheckRoutes } from '../../../../src/routes/personal/personal-phone-numbers-check-routes.js'
const [getPersonalPhoneNumbersCheck, postPersonalPhoneNumbersCheck] = personalPhoneNumbersCheckRoutes

// Mocks
vi.mock('../../../../src/services/personal/fetch-personal-change-service.js', () => ({
  fetchPersonalChangeService: vi.fn()
}))

vi.mock('../../../../src/services/personal/update-personal-phone-numbers-change-service.js', () => ({
  updatePersonalPhoneNumbersChangeService: vi.fn()
}))

describe('personal phone numbers check', () => {
  const request = {
    yar: {},
    auth: {
      credentials: {
        crn: '987654321',
        email: 'test@example.com'
      }
    }
  }

  let h

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /account-phone-numbers-check', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        fetchPersonalChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method and path configured', () => {
        expect(getPersonalPhoneNumbersCheck.method).toBe('GET')
        expect(getPersonalPhoneNumbersCheck.path).toBe('/account-phone-numbers-check')
      })

      test('it fetches the data from the session', async () => {
        await getPersonalPhoneNumbersCheck.handler(request, h)

        expect(fetchPersonalChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changePersonalPhoneNumbers')
      })

      test('should render personal-phone-numbers-check view with page data', async () => {
        await getPersonalPhoneNumbersCheck.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('personal/personal-phone-numbers-check', getPageData())
      })
    })
  })

  describe('POST /account-phone-numbers-check', () => {
    beforeEach(() => {
      h = {
        redirect: vi.fn(() => h)
      }
    })

    describe('when a request succeeds', () => {
      test('should have the correct method and path configured', () => {
        expect(postPersonalPhoneNumbersCheck.method).toBe('POST')
        expect(postPersonalPhoneNumbersCheck.path).toBe('/account-phone-numbers-check')
      })

      test('it redirects to the /personal-details page', async () => {
        await postPersonalPhoneNumbersCheck.handler(request, h)

        expect(h.redirect).toHaveBeenCalledWith('/personal-details')
      })

      test('calls updatePersonalPhoneNumbersChangeService with yar and credentials', async () => {
        await postPersonalPhoneNumbersCheck.handler(request, h)

        expect(updatePersonalPhoneNumbersChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials)
      })
    })
  })
})

const getMockData = () => {
  return {
    crn: '987654321',
    info: {
      userName: 'John Doe',
      fullName: {
        first: 'John',
        last: 'Doe'
      }
    },
    contact: {
      telephone: '01234567890',
      mobile: null
    },
    changePersonalPhoneNumbers: {
      personalTelephone: '01234567890',
      personalMobile: null
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/account-phone-numbers-change' },
    changeLink: '/account-phone-numbers-change',
    pageTitle: 'Check your personal phone numbers are correct before submitting',
    metaDescription: 'Check the phone numbers for your personal account are correct.',
    userName: 'John Doe',
    personalTelephone: {
      telephone: '01234567890',
      mobile: null
    }
  }
}
