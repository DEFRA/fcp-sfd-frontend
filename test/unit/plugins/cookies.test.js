import { constants } from '@defra/fcp-sfd-frontend-engine'
import { vi, beforeEach, describe, test, expect } from 'vitest'
import { getCurrentPolicy, removeAnalytics } from '../../../src/utils/cookies.js'

const mockConfigGet = vi.fn()
vi.mock('../../../src/config/index.js', () => ({
  config: {
    get: mockConfigGet
  }
}))

vi.mock('../../../src/utils/cookies.js', () => ({
  getCurrentPolicy: vi.fn(),
  removeAnalytics: vi.fn()
}))

let cookiesPlugin

describe('cookies plugin', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    mockConfigGet.mockImplementation((key) => {
      switch (key) {
        case 'cookie.name':
          return 'fcp_sfd_cookie_policy'
        case 'cookie.policy':
          return { isSecure: true }
        default:
          return undefined
      }
    })

    cookiesPlugin = (await import('../../../src/plugins/cookies.js')).cookies
  })

  test('should return an object', () => {
    expect(cookiesPlugin).toBeInstanceOf(Object)
  })

  test('should name the plugin', () => {
    expect(cookiesPlugin.plugin.name).toBe('cookies')
  })

  describe('register', () => {
    let mockServer
    let onPreResponseHandler

    beforeEach(() => {
      mockServer = {
        state: vi.fn(),
        ext: vi.fn().mockImplementation((event, handler) => {
          if (event === 'onPreResponse') {
            onPreResponseHandler = handler
          }
        })
      }

      cookiesPlugin.plugin.register(mockServer, {})
    })

    test('should register the cookie policy state', () => {
      expect(mockServer.state).toHaveBeenCalledWith('fcp_sfd_cookie_policy', { isSecure: true })
    })

    test('should register an onPreResponse handler', () => {
      expect(mockServer.ext).toHaveBeenCalledWith('onPreResponse', expect.any(Function))
    })

    test('should add cookiesPolicy to the view context for view responses', () => {
      const cookiesPolicy = { confirmed: true, analytics: true }
      getCurrentPolicy.mockReturnValue(cookiesPolicy)

      const request = {
        response: {
          variety: 'view',
          statusCode: constants.statusCodes.OK,
          source: { context: {} }
        }
      }
      const h = { continue: Symbol('continue') }

      const result = onPreResponseHandler(request, h)

      expect(request.response.source.context.cookiesPolicy).toBe(cookiesPolicy)
      expect(removeAnalytics).not.toHaveBeenCalled()
      expect(result).toBe(h.continue)
    })

    test('should remove analytics cookies if analytics has not been accepted', () => {
      getCurrentPolicy.mockReturnValue({ confirmed: true, analytics: false })

      const request = {
        response: {
          variety: 'view',
          statusCode: constants.statusCodes.OK,
          source: { context: {} }
        }
      }
      const h = { continue: Symbol('continue') }

      onPreResponseHandler(request, h)

      expect(removeAnalytics).toHaveBeenCalledWith(request, h)
    })

    test('should not add cookiesPolicy for non-view responses', () => {
      const request = {
        response: {
          variety: 'plain',
          statusCode: constants.statusCodes.OK
        }
      }
      const h = { continue: Symbol('continue') }

      onPreResponseHandler(request, h)

      expect(getCurrentPolicy).not.toHaveBeenCalled()
    })

    test.each([
      constants.statusCodes.FORBIDDEN,
      constants.statusCodes.BAD_REQUEST,
      constants.statusCodes.INTERNAL_SERVER_ERROR
    ])('should not add cookiesPolicy when the status code is %i', (statusCode) => {
      const request = {
        response: {
          variety: 'view',
          statusCode,
          source: { context: {} }
        }
      }
      const h = { continue: Symbol('continue') }

      onPreResponseHandler(request, h)

      expect(getCurrentPolicy).not.toHaveBeenCalled()
    })
  })
})
