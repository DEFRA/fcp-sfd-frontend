// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'
import { updatePersonalNameChangeService } from '../../../../src/services/personal/update-personal-name-change-service.js'

// Thing under test
import { personalNameCheckRoutes } from '../../../../src/routes/personal/personal-name-check-routes.js'
const [getPersonalNameCheck, postPersonalNameCheck] = personalNameCheckRoutes

// Mocks
vi.mock('../../../../src/services/personal/fetch-personal-change-service.js', () => ({
  fetchPersonalChangeService: vi.fn()
}))

vi.mock('../../../../src/services/personal/update-personal-name-change-service.js', () => ({
  updatePersonalNameChangeService: vi.fn()
}))

describe('personal name check', () => {
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

  describe('GET /account-name-check', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        fetchPersonalChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method and path', () => {
        expect(getPersonalNameCheck.method).toBe('GET')
        expect(getPersonalNameCheck.path).toBe('/account-name-check')
      })

      test('it fetches the data from the session', async () => {
        await getPersonalNameCheck.handler(request, h)

        expect(fetchPersonalChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changePersonalName')
      })

      test('should render personal-name-check view with page data', async () => {
        await getPersonalNameCheck.handler(request, h)
        expect(h.view).toHaveBeenCalledWith('personal/personal-name-check', getPageData())
      })
    })
  })

  describe('POST /account-name-check', () => {
    beforeEach(() => {
      h = {
        redirect: vi.fn(() => h)
      }
    })

    describe('when a request succeeds', () => {
      test('it redirects to the /personal-details page', async () => {
        await postPersonalNameCheck.handler(request, h)

        expect(h.redirect).toHaveBeenCalledWith('/personal-details')
      })

      test('calls updatePersonalNameChangeService with yar and credentials', async () => {
        await postPersonalNameCheck.handler(request, h)

        expect(updatePersonalNameChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials)
      })
    })
  })
})

const getMockData = () => {
  return {
    info: {
      fullName: {
        fullNameJoined: 'Alfred Waldron'
      }
    },
    changePersonalName: {
      first: 'John',
      middle: 'A',
      last: 'Doe'
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/account-name-change' },
    changeLink: '/account-name-change',
    pageTitle: 'Check your name is correct before submitting',
    metaDescription: 'Check the full name for your personal account is correct.',
    userName: 'Alfred Waldron',
    fullName: 'John A Doe'
  }
}
