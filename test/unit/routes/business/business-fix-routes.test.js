// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { businessFixPresenter } from '../../../../src/presenters/business/business-fix-presenter.js'
import { initialiseFixJourneyService } from '../../../../src/services/initialise-fix-journey-service.js'
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'

// Thing under test
import { businessFixRoutes } from '../../../../src/routes/business/business-fix-routes.js'
const [getBusinessFix, postBusinessFix] = businessFixRoutes

// Mocks
vi.mock('../../../../src/presenters/business/business-fix-presenter.js', () => ({
  businessFixPresenter: vi.fn()
}))

vi.mock('../../../../src/services/initialise-fix-journey-service.js', () => ({
  initialiseFixJourneyService: vi.fn()
}))

vi.mock('../../../../src/services/business/fetch-business-details-service.js', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

describe('business fix routes', () => {
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

  describe('GET /business-fix', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        initialiseFixJourneyService.mockReturnValue(getMockSessionData())
        fetchBusinessDetailsService.mockReturnValue('business details')
        businessFixPresenter.mockReturnValue(getPageData())
      })

      test('should have the correct method and path configured', () => {
        expect(getBusinessFix.method).toBe('GET')
        expect(getBusinessFix.path).toBe('/business-fix')
      })

      test('it calls fetchBusinessDetailsService', async () => {
        await getBusinessFix.handler(request, h)

        expect(fetchBusinessDetailsService).toHaveBeenCalledWith(request.auth.credentials)
      })

      test('it initialises the business fix journey using the session and source', async () => {
        await getBusinessFix.handler(request, h)

        expect(initialiseFixJourneyService).toHaveBeenCalledWith(request.yar, request.query.source, 'business')
      })

      test('it presents the session data using the businessFixPresenter', async () => {
        await getBusinessFix.handler(request, h)

        expect(businessFixPresenter).toHaveBeenCalledWith(getMockSessionData(), 'business details')
      })

      test('it renders the business-fix view with page data', async () => {
        await getBusinessFix.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-fix.njk', getPageData())
      })
    })
  })

  describe('POST /business-fix', () => {
    beforeEach(() => {
      h = {
        redirect: vi.fn(() => h)
      }
    })

    test('should have the correct method and path configured', () => {
      expect(postBusinessFix.method).toBe('POST')
      expect(postBusinessFix.path).toBe('/business-fix')
    })

    test('it redirects to the business fix list page', async () => {
      await postBusinessFix.handler({}, h)

      expect(h.redirect).toHaveBeenCalledWith('/business-fix-list')
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
    backLink: { href: '/business-details' },
    pageTitle: 'Update your business details',
    metaDescription: 'Update your business details.',
    updateText: 'We will ask you to update your business email address as well as your business name.',
    listOfErrors: []
  }
}
