// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'
import { updatePersonalEmailChangeService } from '../../../../src/services/personal/update-personal-email-change-service.js'

// Thing under test
import { personalEmailCheckRoutes } from '../../../../src/routes/personal/personal-email-check-routes.js'
const [getPersonalEmailCheck, postPersonalEmailCheck] = personalEmailCheckRoutes

// Mocks
vi.mock('../../../../src/services/personal/fetch-personal-change-service.js', () => ({
  fetchPersonalChangeService: vi.fn()
}))

vi.mock('../../../../src/services/personal/update-personal-email-change-service.js', () => ({
  updatePersonalEmailChangeService: vi.fn()
}))

describe('personal email check', () => {
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

  describe('GET /account-email-check', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        fetchPersonalChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method and path', () => {
        expect(getPersonalEmailCheck.method).toBe('GET')
        expect(getPersonalEmailCheck.path).toBe('/account-email-check')
      })

      test('it fetches the data from the session', async () => {
        await getPersonalEmailCheck.handler(request, h)

        expect(fetchPersonalChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changePersonalEmail')
      })

      test('should render personal-email-check view with page data', async () => {
        await getPersonalEmailCheck.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('personal/personal-email-check', getPageData())
      })
    })
  })

  describe('POST /account-email-check', () => {
    beforeEach(() => {
      h = {
        redirect: vi.fn(() => h)
      }
    })

    describe('when a request succeeds', () => {
      test('it redirects to the /personal-details page', async () => {
        await postPersonalEmailCheck.handler(request, h)

        expect(h.redirect).toHaveBeenCalledWith('/personal-details')
      })

      test('calls updatePersonalEmailChangeService with yar and credentials', async () => {
        await postPersonalEmailCheck.handler(request, h)

        expect(updatePersonalEmailChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials)
      })
    })
  })
})

const getMockData = () => {
  return {
    info: {
      fullName: {
        first: 'John',
        last: 'Doe'
      }
    },
    contact: {
      email: 'test@example.com'
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/account-email-change' },
    changeLink: '/account-email-change',
    pageTitle: 'Check your personal email address is correct before submitting',
    metaDescription: 'Check the email address for your personal account is correct.',
    userName: 'John Doe',
    personalEmail: 'test@example.com'
  }
}
