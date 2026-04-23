// Test framework dependencies
import { vi, describe, beforeEach, test, expect } from 'vitest'
import Boom from '@hapi/boom'

// Things we need to mock
import { getPermissions } from '../../../src/auth/get-permissions.js'
import { getSignOutUrl } from '../../../src/auth/get-sign-out-url.js'
import { validateState } from '../../../src/auth/state.js'
import { verifyToken } from '../../../src/auth/verify-token.js'
import { allowListService } from '../../../src/services/allow-list-service.js'

// Thing under test
import { auth } from '../../../src/routes/auth-routes.js'

// Mocks
vi.mock('../../../src/auth/get-permissions.js', () => ({
  getPermissions: vi.fn()
}))

vi.mock('../../../src/auth/get-sign-out-url.js', () => ({
  getSignOutUrl: vi.fn()
}))

vi.mock('../../../src/auth/state.js', () => ({
  validateState: vi.fn()
}))

vi.mock('../../../src/auth/verify-token.js', () => ({
  verifyToken: vi.fn()
}))

vi.mock('../../../src/services/allow-list-service.js', () => ({
  allowListService: vi.fn()
}))

let route

describe('auth', () => {
  beforeEach(() => {
    route = null
    vi.clearAllMocks()

    verifyToken.mockResolvedValue()
    getPermissions.mockResolvedValue({ privileges: ['user'], businessName: 'Test Business' })
  })

  test('should return an array of routes', () => {
    expect(auth).toBeInstanceOf(Array)
  })

  describe('GET /auth/sign-in', () => {
    beforeEach(() => {
      route = getRoute('GET', '/auth/sign-in')
    })

    test('should exist', () => {
      expect(route).toBeDefined()
    })

    test('should require authentication with Defra Identity', () => {
      expect(route.options.auth).toBe('defra-id')
    })

    test('should have a handler', () => {
      expect(route.handler).toBeInstanceOf(Function)
    })

    test('handler should redirect to /home', () => {
      const mockH = { redirect: vi.fn() }
      route.handler({}, mockH)

      expect(mockH.redirect).toHaveBeenCalledWith('/home')
    })
  })

  describe('GET /auth/sign-in-oidc', () => {
    beforeEach(() => {
      route = getRoute('GET', '/auth/sign-in-oidc')
    })

    test('should exist', () => {
      expect(route).toBeDefined()
    })

    test('should attempt authentication with Defra Identity', () => {
      expect(route.options.auth.strategy).toBe('defra-id')
      expect(route.options.auth.mode).toBe('try')
    })

    test('should have a handler', () => {
      expect(route.handler).toBeInstanceOf(Function)
    })

    test('handler should return unauthorised view when not authenticated', async () => {
      const mockH = { view: vi.fn() }
      const mockRequest = { auth: { isAuthenticated: false } }
      await route.handler(mockRequest, mockH)

      expect(mockH.view).toHaveBeenCalledWith('unauthorised')
    })

    test('handler should verify token when authenticated', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = createMockRequest()
      await route.handler(mockRequest, mockH)

      expect(verifyToken).toHaveBeenCalledWith('token')
    })

    test('handler should call getPermissions with correct parameters', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = createMockRequest()
      await route.handler(mockRequest, mockH)

      expect(getPermissions).toHaveBeenCalledWith('123', '456', 'token')
    })

    test('handler should set isOnFarmingPaymentsAllowList in yar', async () => {
      const mockH = { redirect: vi.fn() }
      const mockYarSet = vi.fn()
      const mockRequest = createMockRequest({ yar: { ...createMockRequest().yar, set: mockYarSet } })
      allowListService.mockReturnValue(true)

      await route.handler(mockRequest, mockH)

      expect(mockYarSet).toHaveBeenCalledWith('isOnFarmingPaymentsAllowList', true)
    })

    test('handler should set session cache with correct data', async () => {
      const mockH = { redirect: vi.fn() }
      const mockCacheSet = vi.fn()
      const mockRequest = createMockRequest({
        server: {
          app: {
            cache: {
              set: mockCacheSet,
              get: vi.fn(),
              drop: vi.fn()
            }
          }
        }
      })

      await route.handler(mockRequest, mockH)

      expect(mockCacheSet).toHaveBeenCalledWith('session-id', expect.objectContaining({
        isAuthenticated: true,
        sbi: '123',
        crn: '456',
        sessionId: 'session-id',
        businessName: 'Test Business',
        scope: ['user'],
        token: 'token',
        refreshToken: 'refresh-token'
      }))
    })

    test('handler should set cookie auth', async () => {
      const mockH = { redirect: vi.fn() }
      const mockCookieAuthSet = vi.fn()
      const mockRequest = createMockRequest({
        cookieAuth: {
          set: mockCookieAuthSet,
          clear: vi.fn()
        }
      })

      await route.handler(mockRequest, mockH)

      expect(mockCookieAuthSet).toHaveBeenCalledWith({ sessionId: 'session-id' })
    })

    test('handler should redirect to safe redirect path', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = createMockRequest()

      await route.handler(mockRequest, mockH)

      expect(mockH.redirect).toHaveBeenCalledWith('/home')
    })

    test('handler should bubble forbidden error when getPermissions throws', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = createMockRequest()
      getPermissions.mockRejectedValue(Boom.forbidden('Failed to retrieve permissions'))

      await expect(route.handler(mockRequest, mockH)).rejects.toMatchObject({
        isBoom: true,
        output: {
          statusCode: 403
        }
      })

      expect(mockH.redirect).not.toHaveBeenCalled()
    })

    test('handler should throw forbidden when getPermissions returns invalid payload', async () => {
      const mockH = { redirect: vi.fn() }
      const mockCacheSet = vi.fn()
      const mockRequest = createMockRequest({
        server: {
          app: {
            cache: {
              set: mockCacheSet,
              get: vi.fn(),
              drop: vi.fn()
            }
          }
        }
      })
      getPermissions.mockResolvedValue({ privileges: undefined, businessName: undefined })

      await expect(route.handler(mockRequest, mockH)).rejects.toMatchObject({
        isBoom: true,
        output: {
          statusCode: 403
        }
      })

      expect(mockCacheSet).not.toHaveBeenCalled()
      expect(mockH.redirect).not.toHaveBeenCalled()
    })
  })

  describe('GET /auth/sign-out', () => {
    beforeEach(() => {
      route = getRoute('GET', '/auth/sign-out')
    })

    test('should exist', () => {
      expect(route).toBeDefined()
    })

    test('should try and authenticate with default authentication strategy', () => {
      expect(route.options.auth.mode).toBe('try')
      expect(route.options.auth.strategy).toBeUndefined()
    })

    test('should have a handler', () => {
      expect(route.handler).toBeInstanceOf(Function)
    })

    test('handler should redirect to / when not authenticated', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = { auth: { isAuthenticated: false }, yar: { reset: vi.fn() } }
      await route.handler(mockRequest, mockH)

      expect(mockH.redirect).toHaveBeenCalledWith('/')
    })

    test('handler should reset yar session', async () => {
      const mockH = { redirect: vi.fn() }
      const mockYarReset = vi.fn()
      const mockRequest = { auth: { isAuthenticated: false }, yar: { reset: mockYarReset } }
      await route.handler(mockRequest, mockH)

      expect(mockYarReset).toHaveBeenCalled()
    })

    test('handler should get sign out url when authenticated', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = createMockRequest()
      getSignOutUrl.mockResolvedValue('https://sign-out-url.com')
      await route.handler(mockRequest, mockH)

      expect(getSignOutUrl).toHaveBeenCalledWith(mockRequest, 'token')
      expect(mockH.redirect).toHaveBeenCalledWith('https://sign-out-url.com')
    })
  })

  describe('GET /auth/sign-out-oidc', () => {
    beforeEach(() => {
      route = getRoute('GET', '/auth/sign-out-oidc')
    })

    test('handler should redirect to /signed-out when not authenticated', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = { auth: { isAuthenticated: false } }

      await route.handler(mockRequest, mockH)

      expect(mockH.redirect).toHaveBeenCalledWith('/signed-out')
    })

    test('handler should validate state when authenticated', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = createMockRequest({ query: { state: 'test-state' } })
      await route.handler(mockRequest, mockH)

      expect(validateState).toHaveBeenCalledWith(mockRequest, 'test-state')
    })

    test('handler should drop cache and clear cookie auth when session id present', async () => {
      const mockH = { redirect: vi.fn() }
      const mockCacheDrop = vi.fn()
      const mockCookieAuthClear = vi.fn()

      const mockRequest = createMockRequest({
        auth: { isAuthenticated: true, credentials: { sessionId: 'session-id' } },
        server: { app: { cache: { drop: mockCacheDrop } } },
        cookieAuth: { clear: mockCookieAuthClear }
      })

      await route.handler(mockRequest, mockH)

      expect(mockCacheDrop).toHaveBeenCalledWith('session-id')
      expect(mockCookieAuthClear).toHaveBeenCalled()
      expect(mockH.redirect).toHaveBeenCalledWith('/signed-out')
    })

    test('handler should not drop cache when session id missing', async () => {
      const mockH = { redirect: vi.fn() }
      const mockCacheDrop = vi.fn()
      const mockRequest = createMockRequest({
        auth: { isAuthenticated: true, credentials: {} },
        server: { app: { cache: { drop: mockCacheDrop } } }
      })
      await route.handler(mockRequest, mockH)

      expect(mockCacheDrop).not.toHaveBeenCalled()
    })
  })

  describe('GET /auth/organisation', () => {
    beforeEach(() => {
      route = getRoute('GET', '/auth/organisation')
    })

    test('redirect to the home page', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = createMockRequest()
      await route.handler(mockRequest, mockH)

      expect(mockH.redirect).toHaveBeenCalledWith('/home')
    })
  })

  describe('GET /auth/reselect-business', () => {
    beforeEach(() => {
      route = getRoute('GET', '/auth/reselect-business')
    })

    test('handler redirects when not authenticated', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = { auth: { isAuthenticated: false } }
      await route.handler(mockRequest, mockH)

      expect(mockH.redirect).toHaveBeenCalledWith('/auth/sign-in')
    })

    test('handler sets redirect and redirects when authenticated', async () => {
      const mockH = { redirect: vi.fn() }
      const mockYarSet = vi.fn()
      const mockRequest = createMockRequest({
        yar: {
          ...createMockRequest().yar,
          set: mockYarSet
        }
      })
      await route.handler(mockRequest, mockH)

      expect(mockH.redirect).toHaveBeenCalledWith('/auth/sign-in')
    })
  })
})

// Helpers
function createMockRequest (overrides = {}) {
  const cache = { set: vi.fn(), get: vi.fn(), drop: vi.fn() }
  const cookieAuth = { set: vi.fn(), clear: vi.fn() }
  const yar = { get: vi.fn().mockReturnValue(null), set: vi.fn(), clear: vi.fn(), reset: vi.fn() }

  return {
    auth: {
      isAuthenticated: true,
      credentials: {
        profile: { sbi: '123', crn: '456', sessionId: 'session-id' },
        token: 'token',
        refreshToken: 'refresh-token'
      }
    },
    server: { app: { cache } },
    cookieAuth,
    yar,
    query: {},
    ...overrides
  }
}

function getRoute (method, path) {
  return auth.find(r => r.method === method && r.path === path)
}
