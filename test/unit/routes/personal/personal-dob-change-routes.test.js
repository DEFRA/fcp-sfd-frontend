// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'
import { formatDateValidationErrors } from '../../../../src/utils/format-date-validation-errors.js'

// Thing under test
import { personalDobChangeRoutes } from '../../../../src/routes/personal/personal-dob-change-routes.js'
const [getPersonalDobChange, postPersonalDobChange] = personalDobChangeRoutes

// Mocks
vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

vi.mock('../../../../src/services/personal/fetch-personal-change-service.js', () => ({
  fetchPersonalChangeService: vi.fn()
}))

vi.mock('../../../../src/utils/format-date-validation-errors.js', () => ({
  formatDateValidationErrors: vi.fn()
}))

describe('personal date of birth change', () => {
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

  describe('GET /account-date-of-birth-change', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchPersonalChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method and path', () => {
        expect(getPersonalDobChange.method).toBe('GET')
        expect(getPersonalDobChange.path).toBe('/account-date-of-birth-change')
      })

      test('it fetches the data from the session', async () => {
        await getPersonalDobChange.handler(request, h)

        expect(fetchPersonalChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changePersonalDob')
      })

      test('should render personal-dob-change view with page data', async () => {
        await getPersonalDobChange.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('personal/personal-dob-change', getPageData())
      })
    })
  })

  describe('POST /account-date-of-birth-change', () => {
    beforeEach(() => {
      request.payload = { day: '7', month: '9', year: '1985' }

      fetchPersonalChangeService.mockResolvedValue({ ...getMockData(), changePersonalDob: request.payload })
    })

    describe('when a request succeeds', () => {
      describe('and the validation passes', () => {
        test('it sets the session data and redirects', async () => {
          await postPersonalDobChange.options.handler(request, h)

          expect(setSessionData).toHaveBeenCalledWith(
            request.yar,
            'personalDetails',
            'changePersonalDob',
            request.payload
          )
          expect(h.redirect).toHaveBeenCalledWith('/account-date-of-birth-check')
        })
      })
      describe('and the validation fails', () => {
        test('it calls formatDateValidationErrors with error details ', async () => {
          const details = 'anything'
          const err = { details }
          await postPersonalDobChange.options.validate.failAction(request, h, err)

          expect(formatDateValidationErrors).toHaveBeenCalledWith(details)
        })
      })
    })
  })
})

const getMockData = () => {
  return {
    info: {
      dateOfBirth: '1982-07-05',
      fullName: {
        fullNameJoined: 'John Doe'
      }
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What is your date of birth?',
    hint: 'For example, 31 3 1980',
    metaDescription: 'Update the date of birth for your personal account.',
    userName: 'John Doe',
    day: 5,
    month: 7,
    year: 1982
  }
}
