// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchBusinessFixService } from '../../../../src/services/business/fetch-business-fix-service.js'
import { updateBusinessFixService } from '../../../../src/services/business/update-business-fix-service.js'

// Thing under test
import { businessFixCheckRoutes } from '../../../../src/routes/business/business-fix-check-routes.js'
const [getBusinessFixCheck, postBusinessFixCheck] = businessFixCheckRoutes

// Mocks
vi.mock('../../../../src/services/business/fetch-business-fix-service.js', () => ({
  fetchBusinessFixService: vi.fn()
}))

vi.mock('../../../../src/services/business/update-business-fix-service.js', () => ({
  updateBusinessFixService: vi.fn()
}))

describe('business fix check routes', () => {
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

  describe('GET /business-fix-check', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        fetchBusinessFixService.mockResolvedValue({
          changeBusinessName: { businessName: 'New Business Name' },
          changeBusinessEmail: { businessEmail: 'newemail@new.com' },
          orderedSectionsToFix: ['name', 'email'],
          customer: { userName: 'Jane Doe' },
          info: { sbi: '123456789' }
        })
      })

      test('should have the correct method and path configured', () => {
        expect(getBusinessFixCheck.method).toBe('GET')
        expect(getBusinessFixCheck.path).toBe('/business-fix-check')
      })

      test('should have a pre-handler to guard the interrupted journey session', () => {
        expect(getBusinessFixCheck.options.pre).toHaveLength(1)
      })

      describe('pre-handler execution', () => {
        test('should redirect to /business-details when interrupted journey session is missing', async () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue(null) } }
          const redirectStub = {}
          const preHandler = getBusinessFixCheck.options.pre[0]
          const preResponse = preHandler.method(sessionRequest, {
            redirect: vi.fn().mockReturnValue({ takeover: vi.fn().mockReturnValue(redirectStub) })
          })

          expect(preResponse).toBe(redirectStub)
        })

        test('should allow access when interrupted journey session is valid', () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({ orderedSectionsToFix: ['name'] }) } }
          const preHandler = getBusinessFixCheck.options.pre[0]
          const preResponse = preHandler.method(sessionRequest, { continue: {} })

          expect(preResponse).toBe(true)
        })
      })

      test('it fetches business fix data using credentials and session data', async () => {
        await getBusinessFixCheck.handler(request, h)

        expect(fetchBusinessFixService).toHaveBeenCalledWith(credentials, sessionData)
      })

      test('it renders the business-fix-check view with page data', async () => {
        await getBusinessFixCheck.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-fix-check.njk', getPageData())
      })
    })
  })

  describe('POST /business-fix-check', () => {
    beforeEach(() => {
      h = {
        redirect: vi.fn()
      }
    })

    describe('when a request succeeds', () => {
      test('should have the correct method and path configured', () => {
        expect(postBusinessFixCheck.method).toBe('POST')
        expect(postBusinessFixCheck.path).toBe('/business-fix-check')
      })

      test('should have a pre-handler to guard the interrupted journey session', () => {
        expect(postBusinessFixCheck.options.pre).toHaveLength(1)
      })

      describe('pre-handler execution', () => {
        test('should redirect to /business-details when interrupted journey session is missing', async () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue(null) } }
          const redirectStub = {}
          const preHandler = postBusinessFixCheck.options.pre[0]
          const preResponse = preHandler.method(sessionRequest, {
            redirect: vi.fn().mockReturnValue({ takeover: vi.fn().mockReturnValue(redirectStub) })
          })

          expect(preResponse).toBe(redirectStub)
        })

        test('should allow access when interrupted journey session is valid', () => {
          const sessionRequest = { yar: { get: vi.fn().mockReturnValue({ orderedSectionsToFix: ['name'] }) } }
          const preHandler = postBusinessFixCheck.options.pre[0]
          const preResponse = preHandler.method(sessionRequest, { continue: {} })

          expect(preResponse).toBe(true)
        })
      })

      test('it redirects to the /business-details page', async () => {
        await postBusinessFixCheck.handler(request, h)

        expect(h.redirect).toHaveBeenCalledWith('/business-details')
      })

      test('it calls updateBusinessFixService with yar and credentials', async () => {
        await postBusinessFixCheck.handler(request, h)

        expect(updateBusinessFixService).toHaveBeenCalledWith(sessionData, request.yar, credentials)
        expect(h.redirect).toHaveBeenCalledWith('/business-details')
      })
    })
  })
})

const getPageData = () => {
  return {
    backLink: { href: '/business-fix-list' },
    pageTitle: 'Check your details are correct before submitting',
    metaDescription: 'Check your details are correct before submitting',
    changeLink: '/business-fix-list',
    sections: ['name', 'email'],
    businessName: null,
    changeBusinessName: 'New Business Name',
    sbi: '123456789',
    userName: 'Jane Doe',
    vatNumber: null,
    businessEmail: 'newemail@new.com',
    address: null,
    businessTelephone: {
      telephone: null,
      mobile: null
    }
  }
}
