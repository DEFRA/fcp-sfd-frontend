import { vi, beforeEach, describe, test, expect } from 'vitest'

const mockConfigGet = vi.fn()
vi.mock('../../../src/config/index.js', () => ({
  config: {
    get: mockConfigGet
  }
}))

let cookiesModule

describe('cookies', () => {
  const cookieNamePolicy = 'fcp_sfd_cookie_policy'
  const cookiePolicy = { isSecure: true, isSameSite: 'Lax' }
  const cookieConfig = { ttl: 31536000000 }

  const defaultCookie = {
    confirmed: false,
    essential: true,
    analytics: false
  }

  let request
  let h

  beforeEach(async () => {
    vi.clearAllMocks()
    mockConfigGet.mockImplementation((key) => {
      switch (key) {
        case 'cookie.name':
          return cookieNamePolicy
        case 'cookie.policy':
          return cookiePolicy
        case 'cookie.config':
          return cookieConfig
        default:
          return undefined
      }
    })

    cookiesModule = await import('../../../src/utils/cookies.js')

    request = {
      state: {
        [cookieNamePolicy]: undefined,
        _ga: '123',
        _gid: '123'
      }
    }

    h = {
      state: vi.fn(),
      unstate: vi.fn()
    }
  })

  test('getCurrentPolicy returns default cookie if policy does not exist', () => {
    const result = cookiesModule.getCurrentPolicy(request, h)

    expect(result).toStrictEqual(defaultCookie)
  })

  test('getCurrentPolicy sets default cookie if policy does not exist', () => {
    cookiesModule.getCurrentPolicy(request, h)

    expect(h.state).toHaveBeenCalledWith(
      cookieNamePolicy,
      defaultCookie,
      { ...cookiePolicy, ...cookieConfig }
    )
  })

  test('getCurrentPolicy returns cookie if policy exists', () => {
    request.state[cookieNamePolicy] = { confirmed: true, essential: false, analytics: true }

    const result = cookiesModule.getCurrentPolicy(request, h)

    expect(result).toStrictEqual({ confirmed: true, essential: false, analytics: true })
    expect(h.state).not.toHaveBeenCalled()
  })

  test('updatePolicy sets cookie to accepted', () => {
    request.state[cookieNamePolicy] = defaultCookie

    cookiesModule.updatePolicy(request, h, true)

    expect(h.state).toHaveBeenCalledWith(
      cookieNamePolicy,
      { confirmed: true, essential: true, analytics: true },
      { ...cookiePolicy, ...cookieConfig }
    )
    expect(h.unstate).not.toHaveBeenCalled()
  })

  test('updatePolicy sets cookie to rejected and removes analytics cookies', () => {
    request.state[cookieNamePolicy] = defaultCookie

    cookiesModule.updatePolicy(request, h, false)

    expect(h.state).toHaveBeenCalledWith(
      cookieNamePolicy,
      { confirmed: true, essential: true, analytics: false },
      { ...cookiePolicy, ...cookieConfig }
    )
    expect(h.unstate).toHaveBeenCalledWith('_ga')
    expect(h.unstate).toHaveBeenCalledWith('_gid')
  })

  test('removeAnalytics removes cookies matching the Google Analytics naming pattern', () => {
    request.state = { _ga: '1', _gid: '2', _gat_foo: '3', session: 'keep-me' }

    cookiesModule.removeAnalytics(request, h)

    expect(h.unstate).toHaveBeenCalledWith('_ga')
    expect(h.unstate).toHaveBeenCalledWith('_gid')
    expect(h.unstate).toHaveBeenCalledWith('_gat_foo')
    expect(h.unstate).not.toHaveBeenCalledWith('session')
  })
})
