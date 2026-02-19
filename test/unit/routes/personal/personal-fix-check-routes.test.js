// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchPersonalFixService } from '../../../../src/services/personal/fetch-personal-fix-service.js'
import { updatePersonalFixService } from '../../../../src/services/personal/update-personal-fix-service.js'

// Thing under test
import { personalFixCheckRoutes } from '../../../../src/routes/personal/personal-fix-check-routes.js'
const [getPersonalFixCheck, postPersonalFixCheck] = personalFixCheckRoutes

// Mocks
vi.mock('../../../../src/services/personal/fetch-personal-fix-service.js', () => ({
  fetchPersonalFixService: vi.fn()
}))

vi.mock('../../../../src/services/personal/update-personal-fix-service.js', () => ({
  updatePersonalFixService: vi.fn()
}))

describe('personal fix check routes', () => {
  let request
  let h
  let sessionData

  const credentials = {
    crn: '987654321',
    email: 'test@example.com'
  }

  beforeEach(() => {
    vi.clearAllMocks()

    sessionData = {
      orderedSectionsToFix: ['name', 'email']
    }

    request = {
      yar: {
        get: vi.fn(() => sessionData)
      },
      auth: { credentials }
    }
  })

  describe('GET /personal-fix-check', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        fetchPersonalFixService.mockResolvedValue({
          changePersonalName: { first: 'New', last: 'Person' },
          changePersonalEmail: { personalEmail: 'newemail@new.com' },
          orderedSectionsToFix: ['name', 'email']
        })
      })

      test('should have the correct method and path configured', () => {
        expect(getPersonalFixCheck.method).toBe('GET')
        expect(getPersonalFixCheck.path).toBe('/personal-fix-check')
      })

      test('it fetches personal fix data using credentials and session data', async () => {
        await getPersonalFixCheck.handler(request, h)

        expect(fetchPersonalFixService).toHaveBeenCalledWith(credentials, sessionData)
      })

      test('it renders the personal-fix-check view with page data', async () => {
        await getPersonalFixCheck.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('personal/personal-fix-check.njk', getPageData())
      })
    })
  })

  describe('POST /personal-fix-check', () => {
    beforeEach(() => {
      h = {
        redirect: vi.fn()
      }
    })

    describe('when a request succeeds', () => {
      test('should have the correct method and path configured', () => {
        expect(postPersonalFixCheck.method).toBe('POST')
        expect(postPersonalFixCheck.path).toBe('/personal-fix-check')
      })

      test('it redirects to the /personal-details page', async () => {
        await postPersonalFixCheck.handler(request, h)

        expect(h.redirect).toHaveBeenCalledWith('/personal-details')
      })

      test('it calls updatePersonalFixService with yar and credentials', async () => {
        await postPersonalFixCheck.handler(request, h)

        expect(updatePersonalFixService).toHaveBeenCalledWith(sessionData, request.yar, credentials)
        expect(h.redirect).toHaveBeenCalledWith('/personal-details')
      })
    })
  })
})

const getPageData = () => {
  return {
    userName: null,
    backLink: { href: '/personal-fix-list' },
    pageTitle: 'Check your details are correct before submitting',
    metaDescription: 'Check your details are correct before submitting',
    changeLink: '/personal-fix-list',
    sections: ['name', 'email'],
    fullName: 'New Person',
    dateOfBirth: null,
    personalEmail: 'newemail@new.com',
    address: null,
    personalTelephone: {
      telephone: null,
      mobile: null
    }
  }
}
