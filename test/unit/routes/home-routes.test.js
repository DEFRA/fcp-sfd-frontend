// Test framework dependencies
import { vi, beforeEach, describe, test, expect } from 'vitest'

// Things we need to mock
import { fetchPersonalBusinessDetailsService } from '../../../src/services/fetch-personal-business-details-service.js'
import { homePresenter } from '../../../src/presenters/home-presenter.js'
import { metricsCounter } from '../../../src/utils/metrics.js'

// Thing under test
import { homeRoutes } from '../../../src/routes/home-routes.js'
const [start, home] = homeRoutes

// Mocks
vi.mock('../../../src/services/fetch-personal-business-details-service.js', () => ({
  fetchPersonalBusinessDetailsService: vi.fn()
}))

vi.mock('../../../src/presenters/home-presenter.js', () => ({
  homePresenter: vi.fn()
}))

vi.mock('../../../src/utils/metrics.js', () => ({
  metricsCounter: vi.fn()
}))

describe('Root endpoint', () => {
  let h

  beforeEach(() => {
    vi.clearAllMocks()
    h = {
      view: vi.fn().mockReturnValue({})
    }
  })

  test('should return an object', () => {
    expect(start).toBeInstanceOf(Object)
  })

  test('should return GET / route', () => {
    expect(start.method).toBe('GET')
    expect(start.path).toBe('/')
  })

  test('should try and authenticate using default strategy', () => {
    expect(start.options.auth.strategy).toBeUndefined()
    expect(start.options.auth.mode).toBe('try')
  })

  test('should have a handler', () => {
    expect(start.handler).toBeInstanceOf(Function)
  })

  test('renders start view with page title', () => {
    start.handler({}, h)

    expect(h.view).toHaveBeenCalledWith('start', { pageTitle: 'Start using the Farm and Land Service' })
  })
})

describe('Home endpoint', () => {
  let h
  let request
  let pageData

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /home', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        request = {
          auth: {
            credentials: {
              sbi: '123456789',
              scope: ['BUSINESS_DETAILS:FULL_PERMISSION'],
              enrolmentCount: 7
            }
          },
          yar: {
            get: vi.fn().mockReturnValue(true)
          }
        }

        pageData = getPageData()
        fetchPersonalBusinessDetailsService.mockResolvedValue(getMockData())
        homePresenter.mockReturnValue(pageData)
      })

      test('should have the correct method and path', () => {
        expect(home.method).toBe('GET')
        expect(home.path).toBe('/home')
      })

      test('it calls the fetch personal business details service and renders view', async () => {
        await home.handler(request, h)

        expect(fetchPersonalBusinessDetailsService).toHaveBeenCalledWith(request.auth.credentials)
        expect(homePresenter).toHaveBeenCalledWith(getMockData(), request.auth.credentials.scope, request.auth.credentials.enrolmentCount, true)
        expect(metricsCounter).toHaveBeenCalledWith('users.active')
        expect(h.view).toHaveBeenCalledWith('home', pageData)
      })
    })
  })
})

const getMockData = () => ({
  fullName: 'Alfred Waldron',
  businessName: 'Test Farm Ltd',
  sbi: '123456789'
})

const getPageData = () => ({
  pageTitle: 'Your business',
  metaDescription: 'Home page for your business\'s schemes and details.',
  fullName: 'Alfred Waldron',
  businessName: 'Test Farm Ltd',
  businessDetails: {
    link: '/business-details',
    text: 'View and update your business details'
  },
  sbi: '123456789'
})
