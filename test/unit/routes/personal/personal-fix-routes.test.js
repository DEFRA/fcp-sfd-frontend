// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { personalFixPresenter } from '../../../../src/presenters/personal/personal-fix-presenter.js'
import { initialiseFixJourneyService } from '../../../../src/services/initialise-fix-journey-service.js'
import { fetchPersonalFixService } from '../../../../src/services/personal/fetch-personal-fix-service.js'

// Thing under test
import { personalFixRoutes } from '../../../../src/routes/personal/personal-fix-routes.js'
const [getPersonalFix, postPersonalFix] = personalFixRoutes

// Mocks
vi.mock('../../../../src/presenters/personal/personal-fix-presenter.js', () => ({
  personalFixPresenter: vi.fn()
}))

vi.mock('../../../../src/services/initialise-fix-journey-service.js', () => ({
  initialiseFixJourneyService: vi.fn()
}))

vi.mock('../../../../src/services/personal/fetch-personal-fix-service.js', () => ({
  fetchPersonalFixService: vi.fn()
}))

describe('personal fix routes', () => {
  let request
  let h

  const credentials = {
    sbi: '123456789',
    crn: '987654321',
    email: 'test@example.com'
  }

  beforeEach(() => {
    vi.clearAllMocks()

    request = {
      yar: {},
      query: {
        source: 'name'
      },
      auth: { credentials }
    }
  })

  describe('GET /personal-fix', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        initialiseFixJourneyService.mockReturnValue(getMockSessionData())
        fetchPersonalFixService.mockReturnValue('personal details')
        personalFixPresenter.mockReturnValue(getPageData())
      })

      test('should have the correct method and path configured', () => {
        expect(getPersonalFix.method).toBe('GET')
        expect(getPersonalFix.path).toBe('/personal-fix')
      })

      test('it calls fetchPersonalFixService', async () => {
        await getPersonalFix.handler(request, h)

        expect(fetchPersonalFixService).toHaveBeenCalledWith(request.auth.credentials, getMockSessionData())
      })

      test('it initialises the personal fix journey using the session and source', async () => {
        await getPersonalFix.handler(request, h)

        expect(initialiseFixJourneyService).toHaveBeenCalledWith(request.yar, request.query.source, 'personal')
      })

      test('it presents the session data using the personalFixPresenter', async () => {
        await getPersonalFix.handler(request, h)

        expect(personalFixPresenter).toHaveBeenCalledWith('personal details')
      })

      test('it renders the personal-fix view with page data', async () => {
        await getPersonalFix.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('personal/personal-fix.njk', getPageData())
      })
    })
  })

  describe('POST /personal-fix', () => {
    beforeEach(() => {
      h = {
        redirect: vi.fn(() => h)
      }
    })

    test('should have the correct method and path configured', () => {
      expect(postPersonalFix.method).toBe('POST')
      expect(postPersonalFix.path).toBe('/personal-fix')
    })

    test('it redirects to the personal fix list page', async () => {
      await postPersonalFix.handler({}, h)

      expect(h.redirect).toHaveBeenCalledWith('/personal-fix-list')
    })
  })
})

const getMockSessionData = () => {
  return {
    source: 'name',
    orderedSectionsToFix: ['name', 'email']
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'Update your personal details',
    metaDescription: 'Update your personal details.',
    updateText: 'We will ask you to update your personal email address as well as your personal name.',
    listOfErrors: []
  }
}
