import { vi, describe, beforeEach, test, expect } from 'vitest'

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

vi.mock('../../../src/utils/get-safe-redirect.js', () => ({
  getSafeRedirect: vi.fn()
}))

const { getPermissions } = await import('../../../src/auth/get-permissions.js')
const { getSignOutUrl } = await import('../../../src/auth/get-sign-out-url.js')
const { validateState } = await import('../../../src/auth/state.js')
const { verifyToken } = await import('../../../src/auth/verify-token.js')
const { getSafeRedirect } = await import('../../../src/utils/get-safe-redirect.js')
const { auth } = await import('../../../src/routes/auth-routes.js')

let route

describe('auth', () => {
  beforeEach(() => {
    route = null
    vi.clearAllMocks()
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
      const mockRequest = {
        auth: {
          isAuthenticated: true,
          credentials: {
            profile: { sbi: '123', crn: '456', sessionId: 'session-id' },
            token: 'token',
            refreshToken: 'refresh-token'
          }
        },
        server: {
          app: {
            cache: {
              set: vi.fn()
            }
          }
        },
        cookieAuth: {
          set: vi.fn()
        },
        yar: {
          get: vi.fn().mockReturnValue(null),
          clear: vi.fn()
        }
      }

      verifyToken.mockResolvedValue()
      getPermissions.mockResolvedValue({ privileges: ['user'], businessName: 'Test Business' })
      getSafeRedirect.mockReturnValue('/home')

      await route.handler(mockRequest, mockH)
      expect(verifyToken).toHaveBeenCalledWith('token')
    })

    test('handler should call getPermissions with correct parameters', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = {
        auth: {
          isAuthenticated: true,
          credentials: {
            profile: { sbi: '123', crn: '456', sessionId: 'session-id' },
            token: 'token',
            refreshToken: 'refresh-token'
          }
        },
        server: {
          app: {
            cache: {
              set: vi.fn()
            }
          }
        },
        cookieAuth: {
          set: vi.fn()
        },
        yar: {
          get: vi.fn().mockReturnValue(null),
          clear: vi.fn()
        }
      }

      verifyToken.mockResolvedValue()
      getPermissions.mockResolvedValue({ privileges: ['user'], businessName: 'Test Business' })
      getSafeRedirect.mockReturnValue('/home')

      await route.handler(mockRequest, mockH)
      expect(getPermissions).toHaveBeenCalledWith('123', '456', 'token')
    })

    test('handler should set session cache with correct data', async () => {
      const mockH = { redirect: vi.fn() }
      const mockCacheSet = vi.fn()
      const mockRequest = {
        auth: {
          isAuthenticated: true,
          credentials: {
            profile: { sbi: '123', crn: '456', sessionId: 'session-id' },
            token: 'token',
            refreshToken: 'refresh-token'
          }
        },
        server: {
          app: {
            cache: {
              set: mockCacheSet
            }
          }
        },
        cookieAuth: {
          set: vi.fn()
        },
        yar: {
          get: vi.fn().mockReturnValue(null),
          clear: vi.fn()
        }
      }

      verifyToken.mockResolvedValue()
      getPermissions.mockResolvedValue({ privileges: ['user'], businessName: 'Test Business' })
      getSafeRedirect.mockReturnValue('/home')

      await route.handler(mockRequest, mockH)
      expect(mockCacheSet).toHaveBeenCalledWith('session-id', expect.objectContaining({
        isAuthenticated: true,
        sbi: '123',
        crn: '456',
        sessionId: 'session-id',
        businessName: 'Test Business',
        scope: ['user'],
        token: 'token',
        refreshToken: 'refresh-token',
        isOnFarmingPaymentsWhitelist: false
      }))
    })

    test('handler should set cookie auth', async () => {
      const mockH = { redirect: vi.fn() }
      const mockCookieAuthSet = vi.fn()
      const mockRequest = {
        auth: {
          isAuthenticated: true,
          credentials: {
            profile: { sbi: '123', crn: '456', sessionId: 'session-id' },
            token: 'token',
            refreshToken: 'refresh-token'
          }
        },
        server: {
          app: {
            cache: {
              set: vi.fn()
            }
          }
        },
        cookieAuth: {
          set: mockCookieAuthSet
        },
        yar: {
          get: vi.fn().mockReturnValue(null),
          clear: vi.fn()
        }
      }

      verifyToken.mockResolvedValue()
      getPermissions.mockResolvedValue({ privileges: ['user'], businessName: 'Test Business' })
      getSafeRedirect.mockReturnValue('/home')

      await route.handler(mockRequest, mockH)
      expect(mockCookieAuthSet).toHaveBeenCalledWith({ sessionId: 'session-id' })
    })

    test('handler should redirect to safe redirect path', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = {
        auth: {
          isAuthenticated: true,
          credentials: {
            profile: { sbi: '123', crn: '456', sessionId: 'session-id' },
            token: 'token',
            refreshToken: 'refresh-token'
          }
        },
        server: {
          app: {
            cache: {
              set: vi.fn()
            }
          }
        },
        cookieAuth: {
          set: vi.fn()
        },
        yar: {
          get: vi.fn().mockReturnValue('/custom-path'),
          clear: vi.fn()
        }
      }

      verifyToken.mockResolvedValue()
      getPermissions.mockResolvedValue({ privileges: ['user'], businessName: 'Test Business' })
      getSafeRedirect.mockReturnValue('/safe-path')

      await route.handler(mockRequest, mockH)
      expect(getSafeRedirect).toHaveBeenCalledWith('/custom-path')
      expect(mockH.redirect).toHaveBeenCalledWith('/safe-path')
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
      const mockRequest = {
        auth: { isAuthenticated: false },
        yar: { reset: vi.fn() }
      }

      await route.handler(mockRequest, mockH)
      expect(mockH.redirect).toHaveBeenCalledWith('/')
    })

    test('handler should reset yar session', async () => {
      const mockH = { redirect: vi.fn() }
      const mockYarReset = vi.fn()
      const mockRequest = {
        auth: { isAuthenticated: false },
        yar: { reset: mockYarReset }
      }

      await route.handler(mockRequest, mockH)
      expect(mockYarReset).toHaveBeenCalled()
    })

    test('handler should get sign out url when authenticated', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = {
        auth: {
          isAuthenticated: true,
          credentials: { token: 'token' }
        },
        yar: { reset: vi.fn() }
      }

      getSignOutUrl.mockResolvedValue('https://sign-out-url.com')

      await route.handler(mockRequest, mockH)
      expect(getSignOutUrl).toHaveBeenCalledWith(mockRequest, 'token')
    })

    test('handler should redirect to sign out url when authenticated', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = {
        auth: {
          isAuthenticated: true,
          credentials: { token: 'token' }
        },
        yar: { reset: vi.fn() }
      }

      getSignOutUrl.mockResolvedValue('https://sign-out-url.com')

      await route.handler(mockRequest, mockH)
      expect(mockH.redirect).toHaveBeenCalledWith('https://sign-out-url.com')
    })
  })

  describe('GET /auth/sign-out-oidc', () => {
    beforeEach(() => {
      route = getRoute('GET', '/auth/sign-out-oidc')
    })

    test('should exist', () => {
      expect(route).toBeDefined()
    })

    test('should attempt to authenticate with default strategy', () => {
      expect(route.options.auth.strategy).toBeUndefined()
      expect(route.options.auth.mode).toBe('try')
    })

    test('should have a handler', () => {
      expect(route.handler).toBeInstanceOf(Function)
    })

    test('handler should redirect to /signed-out when not authenticated', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = {
        auth: { isAuthenticated: false }
      }

      await route.handler(mockRequest, mockH)
      expect(mockH.redirect).toHaveBeenCalledWith('/signed-out')
    })

    test('handler should validate state when authenticated', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = {
        auth: {
          isAuthenticated: true,
          credentials: { sessionId: 'session-id' }
        },
        query: { state: 'test-state' },
        server: {
          app: {
            cache: {
              drop: vi.fn()
            }
          }
        },
        cookieAuth: {
          clear: vi.fn()
        }
      }

      await route.handler(mockRequest, mockH)
      expect(validateState).toHaveBeenCalledWith(mockRequest, 'test-state')
    })

    test('handler should drop cache when authenticated with session id', async () => {
      const mockH = { redirect: vi.fn() }
      const mockCacheDrop = vi.fn()
      const mockRequest = {
        auth: {
          isAuthenticated: true,
          credentials: { sessionId: 'session-id' }
        },
        query: { state: 'test-state' },
        server: {
          app: {
            cache: {
              drop: mockCacheDrop
            }
          }
        },
        cookieAuth: {
          clear: vi.fn()
        }
      }

      await route.handler(mockRequest, mockH)
      expect(mockCacheDrop).toHaveBeenCalledWith('session-id')
    })

    test('handler should not drop cache when authenticated without session id', async () => {
      const mockH = { redirect: vi.fn() }
      const mockCacheDrop = vi.fn()
      const mockRequest = {
        auth: {
          isAuthenticated: true,
          credentials: {}
        },
        query: { state: 'test-state' },
        server: {
          app: {
            cache: {
              drop: mockCacheDrop
            }
          }
        },
        cookieAuth: {
          clear: vi.fn()
        }
      }

      await route.handler(mockRequest, mockH)
      expect(mockCacheDrop).not.toHaveBeenCalled()
    })

    test('handler should clear cookie auth when authenticated', async () => {
      const mockH = { redirect: vi.fn() }
      const mockCookieAuthClear = vi.fn()
      const mockRequest = {
        auth: {
          isAuthenticated: true,
          credentials: { sessionId: 'session-id' }
        },
        query: { state: 'test-state' },
        server: {
          app: {
            cache: {
              drop: vi.fn()
            }
          }
        },
        cookieAuth: {
          clear: mockCookieAuthClear
        }
      }

      await route.handler(mockRequest, mockH)
      expect(mockCookieAuthClear).toHaveBeenCalled()
    })

    test('handler should redirect to /signed-out when authenticated', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = {
        auth: {
          isAuthenticated: true,
          credentials: { sessionId: 'session-id' }
        },
        query: { state: 'test-state' },
        server: {
          app: {
            cache: {
              drop: vi.fn()
            }
          }
        },
        cookieAuth: {
          clear: vi.fn()
        }
      }

      await route.handler(mockRequest, mockH)
      expect(mockH.redirect).toHaveBeenCalledWith('/signed-out')
    })
  })

  describe('GET /auth/organisation', () => {
    beforeEach(() => {
      route = getRoute('GET', '/auth/organisation')
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

    test('handler should get redirect from yar', async () => {
      const mockH = { redirect: vi.fn() }
      const mockYarGet = vi.fn().mockReturnValue('/custom-path')
      const mockRequest = {
        yar: {
          get: mockYarGet,
          clear: vi.fn()
        }
      }

      getSafeRedirect.mockReturnValue('/safe-path')

      await route.handler(mockRequest, mockH)
      expect(mockYarGet).toHaveBeenCalledWith('redirect')
    })

    test('handler should clear redirect from yar', async () => {
      const mockH = { redirect: vi.fn() }
      const mockYarClear = vi.fn()
      const mockRequest = {
        yar: {
          get: vi.fn().mockReturnValue(null),
          clear: mockYarClear
        }
      }

      getSafeRedirect.mockReturnValue('/home')

      await route.handler(mockRequest, mockH)
      expect(mockYarClear).toHaveBeenCalledWith('redirect')
    })

    test('handler should use /home as default redirect', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = {
        yar: {
          get: vi.fn().mockReturnValue(null),
          clear: vi.fn()
        }
      }

      getSafeRedirect.mockReturnValue('/home')

      await route.handler(mockRequest, mockH)
      expect(getSafeRedirect).toHaveBeenCalledWith('/home')
    })

    test('handler should ensure redirect is safe', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = {
        yar: {
          get: vi.fn().mockReturnValue('/custom-path'),
          clear: vi.fn()
        }
      }

      getSafeRedirect.mockReturnValue('/safe-path')

      await route.handler(mockRequest, mockH)
      expect(getSafeRedirect).toHaveBeenCalledWith('/custom-path')
    })

    test('handler should redirect to safe path', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = {
        yar: {
          get: vi.fn().mockReturnValue(null),
          clear: vi.fn()
        }
      }

      getSafeRedirect.mockReturnValue('/safe-path')

      await route.handler(mockRequest, mockH)
      expect(mockH.redirect).toHaveBeenCalledWith('/safe-path')
    })
  })

  describe('GET /auth/reselect-business', () => {
    beforeEach(() => {
      route = getRoute('GET', '/auth/reselect-business')
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

    test('handler should redirect to /auth/sign-in when not authenticated', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = {
        auth: { isAuthenticated: false }
      }

      await route.handler(mockRequest, mockH)
      expect(mockH.redirect).toHaveBeenCalledWith('/auth/sign-in')
    })

    test('handler should set redirect to /home in yar when authenticated', async () => {
      const mockH = { redirect: vi.fn() }
      const mockYarSet = vi.fn()
      const mockRequest = {
        auth: { isAuthenticated: true },
        yar: {
          set: mockYarSet
        }
      }

      await route.handler(mockRequest, mockH)
      expect(mockYarSet).toHaveBeenCalledWith('redirect', '/home')
    })

    test('handler should redirect to /auth/sign-in when authenticated', async () => {
      const mockH = { redirect: vi.fn() }
      const mockRequest = {
        auth: { isAuthenticated: true },
        yar: {
          set: vi.fn()
        }
      }

      await route.handler(mockRequest, mockH)
      expect(mockH.redirect).toHaveBeenCalledWith('/auth/sign-in')
    })
  })
})

function getRoute (method, path) {
  return auth.find(r => r.method === method && r.path === path)
}
