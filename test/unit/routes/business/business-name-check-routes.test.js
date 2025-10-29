// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'
import { updateBusinessNameChangeService } from '../../../../src/services/business/update-business-name-change-service.js'

// Test helpers
import { FULL_PERMISSIONS } from '../../../../src/constants/scope/business-details.js'

// Thing under test
import { businessNameCheckRoutes } from '../../../../src/routes/business/business-name-check-routes.js'
const [getBusinessNameCheck, postBusinessNameCheck] = businessNameCheckRoutes

// Mocks
vi.mock('../../../../src/services/business/fetch-business-change-service.js', () => ({
  fetchBusinessChangeService: vi.fn()
}))

vi.mock('../../../../src/services/business/update-business-name-change-service.js', () => ({
  updateBusinessNameChangeService: vi.fn()
}))

describe('business name check', () => {
  const request = {
    yar: {},
    auth: {
      credentials: {
        sbi: '123456789',
        crn: '987654321',
        email: 'test@example.com'
      }
    }
  }

  let h

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /business-name-enter', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        fetchBusinessChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method, path and auth scope configured', () => {
        expect(getBusinessNameCheck.method).toBe('GET')
        expect(getBusinessNameCheck.path).toBe('/business-name-check')
        expect(getBusinessNameCheck.options.auth.scope).toBe(FULL_PERMISSIONS)
      })

      test('it fetches the data from the session', async () => {
        await getBusinessNameCheck.handler(request, h)

        expect(fetchBusinessChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changeBusinessName')
      })

      test('should render business-name-check view with page data', async () => {
        await getBusinessNameCheck.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-name-check', getPageData())
      })
    })
  })

  describe('POST /business-name-check', () => {
    beforeEach(() => {
      h = {
        redirect: vi.fn(() => h)
      }
    })

    describe('when a request succeeds', () => {
      test('should have the correct method, path and auth scope configured', () => {
        expect(postBusinessNameCheck.method).toBe('POST')
        expect(postBusinessNameCheck.path).toBe('/business-name-check')
        expect(postBusinessNameCheck.options.auth.scope).toBe(FULL_PERMISSIONS)
      })

      test('it redirects to the /business-details page', async () => {
        await postBusinessNameCheck.handler(request, h)

        expect(h.redirect).toHaveBeenCalledWith('/business-details')
      })

      test('calls updateBusinessNameChangeService with yar and credentials', async () => {
        await postBusinessNameCheck.handler(request, h)

        expect(updateBusinessNameChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials)
      })
    })
  })
})

const getMockData = () => {
  return {
    info: {
      sbi: '123456789',
      businessName: 'Agile Farm Ltd'
    },
    customer: {
      fullName: 'Alfred Waldron'
    },
    changeBusinessName: 'New Business Name Ltd'
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/business-name-change' },
    changeLink: '/business-name-change',
    pageTitle: 'Check your business name is correct before submitting',
    metaDescription: 'Check the name for your business is correct.',
    businessName: 'Agile Farm Ltd',
    changeBusinessName: 'New Business Name Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron'
  }
}
