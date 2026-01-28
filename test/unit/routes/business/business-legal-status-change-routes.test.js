// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'

// Test helpers
import { FULL_PERMISSIONS } from '../../../../src/constants/scope/business-details.js'

// Thing under test
import { businessLegalStatusRoutes } from '../../../../src/routes/business/business-legal-status-change-routes.js'
const [getBusinessLegalStatusChange] = businessLegalStatusRoutes

// Mocks
vi.mock('../../../../src/services/business/fetch-business-details-service.js', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

describe('business legal status change', () => {
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
      auth: { credentials },
      payload: {}
    }

    h = {
      view: vi.fn().mockReturnValue({})
    }
  })

  describe('GET /business-legal-status-change', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchBusinessDetailsService.mockReturnValue(getMockData())
      })

      test('should have the correct method, path and auth scope configured', () => {
        expect(getBusinessLegalStatusChange.method).toBe('GET')
        expect(getBusinessLegalStatusChange.path).toBe('/business-legal-status-change')
        expect(getBusinessLegalStatusChange.options.auth.scope).toBe(FULL_PERMISSIONS)
      })

      test('it fetches the data from the fetchBusinessDetailsService', async () => {
        await getBusinessLegalStatusChange.handler(request, h)

        expect(fetchBusinessDetailsService).toHaveBeenCalledWith(request.auth.credentials)
      })

      test('should render business-legal-status-change view with page data', async () => {
        await getBusinessLegalStatusChange.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-legal-status-change', getPageData())
      })
    })
  })
})

const getMockData = () => {
  return {
    info: {
      sbi: '123456789',
      businessName: 'HENLEY, RE',
      legalStatus: 'Sole Proprietorship'
    },
    customer: {
      userName: 'Alfred Waldron'
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Change your legal status',
    metaDescription: 'Update the legal status of your business.',
    businessName: 'HENLEY, RE',
    businessLegalStatus: 'Sole Proprietorship',
    sbi: '123456789',
    userName: 'Alfred Waldron'
  }
}
