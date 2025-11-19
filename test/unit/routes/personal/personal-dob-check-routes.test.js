// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'
import { updatePersonalDobChangeService } from '../../../../src/services/personal/update-personal-dob-change-service.js'

// Thing under test
import { personalDobCheckRoutes } from '../../../../src/routes/personal/personal-dob-check-routes.js'
const [getPersonalDobCheck, postPersonalDobCheck] = personalDobCheckRoutes

// Mocks
vi.mock('../../../../src/services/personal/fetch-personal-change-service.js', () => ({
  fetchPersonalChangeService: vi.fn()
}))

vi.mock('../../../../src/services/personal/update-personal-dob-change-service.js', () => ({
  updatePersonalDobChangeService: vi.fn()
}))

describe('personal dob check', () => {
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

  describe('GET /account-date-of-birth-check ', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        fetchPersonalChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method and path configured', () => {
        expect(getPersonalDobCheck.method).toBe('GET')
        expect(getPersonalDobCheck.path).toBe('/account-date-of-birth-check')
      })

      test('it fetches the data from the session', async () => {
        await getPersonalDobCheck.handler(request, h)

        expect(fetchPersonalChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changePersonalDob')
      })

      test('should render personal-dob-check view with page data', async () => {
        await getPersonalDobCheck.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('personal/personal-dob-check', getPageData())
      })
    })
  })

  describe('POST /account-date-of-birth-check ', () => {
    beforeEach(() => {
      h = {
        redirect: vi.fn(() => h)
      }
    })

    describe('when a request succeeds', () => {
      test('should have the correct method and path configured', () => {
        expect(postPersonalDobCheck.method).toBe('POST')
        expect(postPersonalDobCheck.path).toBe('/account-date-of-birth-check')
      })

      test('it redirects to the /personal-details page', async () => {
        await postPersonalDobCheck.handler(request, h)

        expect(h.redirect).toHaveBeenCalledWith('/personal-details')
      })

      test('calls updatePersonalDobChangeService with yar and credentials', async () => {
        await postPersonalDobCheck.handler(request, h)

        expect(updatePersonalDobChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials)
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

    changePersonalDob: {
      day: '7',
      month: '11',
      year: '2025'
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/account-date-of-birth-change' },
    changeLink: '/account-date-of-birth-change',
    userName: 'John Doe',
    pageTitle: 'Check your date of birth is correct before submitting',
    metaDescription: 'Check the date of birth for your personal account is correct.',
    dateOfBirth: '7 November 2025'
  }
}
