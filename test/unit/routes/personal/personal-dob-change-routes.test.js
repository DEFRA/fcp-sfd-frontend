// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'

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

  describe('GET /personal-dob-change', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchPersonalChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method and path', () => {
        expect(getPersonalDobChange.method).toBe('GET')
        expect(getPersonalDobChange.path).toBe('/personal-dob-change')
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

  describe('POST /personal-dob-change', () => {
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
          expect(h.redirect).toHaveBeenCalledWith('/personal-dob-check')
        })
      })
    })
  })
})

const getMockData = () => {
  return {
    info: {
      dateOfBirth: '1982-07-05'
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What is your date of birth?',
    metaDescription: 'For example, 31 3 1980',
    dobDay: 5,
    dobMonth: 7,
    dobYear: 1982
  }
}
