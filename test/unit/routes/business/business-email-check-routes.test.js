// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'
import { updateBusinessEmailChangeService } from '../../../../src/services/business/update-business-email-change-service.js'

// Test helpers
import { AMEND_PERMISSIONS } from '../../../../src/constants/scope/business-details.js'

// Thing under test
import { businessEmailCheckRoutes } from '../../../../src/routes/business/business-email-check-routes.js'
const [getBusinessEmailCheck, postBusinessEmailCheck] = businessEmailCheckRoutes

// Mocks
vi.mock('../../../../src/services/business/fetch-business-change-service.js', () => ({
  fetchBusinessChangeService: vi.fn()
}))

vi.mock('../../../../src/services/business/update-business-email-change-service.js', () => ({
  updateBusinessEmailChangeService: vi.fn()
}))

describe('business email check', () => {
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

  describe('GET /business-email-check', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        fetchBusinessChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method, path and auth scope configured', () => {
        expect(getBusinessEmailCheck.method).toBe('GET')
        expect(getBusinessEmailCheck.path).toBe('/business-email-check')
        expect(getBusinessEmailCheck.options.auth.scope).toBe(AMEND_PERMISSIONS)
      })

      test('it fetches the data from the session', async () => {
        await getBusinessEmailCheck.handler(request, h)

        expect(fetchBusinessChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changeBusinessEmail')
      })

      test('should render business-email-check view with page data', async () => {
        await getBusinessEmailCheck.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-email-check', getPageData())
      })
    })
  })

  describe('POST /business-email-check', () => {
    beforeEach(() => {
      h = {
        redirect: vi.fn(() => h)
      }
    })

    describe('when a request succeeds', () => {
      test('should have the correct method, path and auth scope configured', () => {
        expect(postBusinessEmailCheck.method).toBe('POST')
        expect(postBusinessEmailCheck.path).toBe('/business-email-check')
        expect(postBusinessEmailCheck.options.auth.scope).toBe(AMEND_PERMISSIONS)
      })

      test('it redirects to the /business-details page', async () => {
        await postBusinessEmailCheck.handler(request, h)

        expect(h.redirect).toHaveBeenCalledWith('/business-details')
      })

      test('calls updateBusinessEmailChangeService with yar and credentials', async () => {
        await postBusinessEmailCheck.handler(request, h)

        expect(updateBusinessEmailChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials)
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
    contact: {
      email: 'test@test.com'
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/business-email-change' },
    changeLink: '/business-email-change',
    pageTitle: 'Check your business email address is correct before submitting',
    metaDescription: 'Check the email address for your business is correct.',
    businessEmail: 'test@test.com',
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron'
  }
}
