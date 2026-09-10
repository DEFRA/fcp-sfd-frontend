import { vi, beforeEach, describe, test, expect } from 'vitest'

const mockConfigGet = vi.fn()
vi.mock('../../../src/config/index.js', () => ({
  config: {
    get: mockConfigGet
  }
}))

let cookiesModule

describe('cookies', () => {
  const cookieNamePolicy = 'cookie_policy'
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
      app: {},
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
    const result = cookiesModule.getCurrentPolicy(request)

    expect(result).toStrictEqual(defaultCookie)
  })

  test('getCurrentPolicy does not write a cookie when no choice has been made', () => {
    cookiesModule.getCurrentPolicy(request)

    expect(h.state).not.toHaveBeenCalled()
  })

  test('getCurrentPolicy returns cookie if policy exists', () => {
    request.state[cookieNamePolicy] = JSON.stringify({ confirmed: true, essential: false, analytics: true })

    const result = cookiesModule.getCurrentPolicy(request)

    expect(result).toStrictEqual({ confirmed: true, essential: false, analytics: true })
    expect(h.state).not.toHaveBeenCalled()
  })

  test('getCurrentPolicy returns the default cookie if the policy cannot be parsed', () => {
    request.state[cookieNamePolicy] = 'not-json'

    const result = cookiesModule.getCurrentPolicy(request)

    expect(result).toStrictEqual(defaultCookie)
  })

  test('updatePolicy sets cookie to accepted and returns the updated policy', () => {
    request.state[cookieNamePolicy] = JSON.stringify(defaultCookie)

    const result = cookiesModule.updatePolicy(request, h, true)

    expect(h.state).toHaveBeenCalledWith(
      cookieNamePolicy,
      JSON.stringify({ confirmed: true, essential: true, analytics: true }),
      { ...cookiePolicy, ...cookieConfig }
    )
    expect(h.unstate).not.toHaveBeenCalled()
    expect(result).toStrictEqual({ confirmed: true, essential: true, analytics: true })
  })

  test('updatePolicy sets cookie to rejected, removes analytics cookies and returns the updated policy', () => {
    request.state[cookieNamePolicy] = JSON.stringify(defaultCookie)

    const result = cookiesModule.updatePolicy(request, h, false)

    expect(h.state).toHaveBeenCalledWith(
      cookieNamePolicy,
      JSON.stringify({ confirmed: true, essential: true, analytics: false }),
      { ...cookiePolicy, ...cookieConfig }
    )
    expect(h.unstate).toHaveBeenCalledWith('_ga')
    expect(h.unstate).toHaveBeenCalledWith('_gid')
    expect(result).toStrictEqual({ confirmed: true, essential: true, analytics: false })
  })

  test('removeAnalytics removes cookies matching the Google Analytics naming pattern', () => {
    request.state = { _ga: '1', _gid: '2', _gat_foo: '3', session: 'keep-me' }

    cookiesModule.removeAnalytics(request, h)

    expect(h.unstate).toHaveBeenCalledWith('_ga')
    expect(h.unstate).toHaveBeenCalledWith('_gid')
    expect(h.unstate).toHaveBeenCalledWith('_gat_foo')
    expect(h.unstate).not.toHaveBeenCalledWith('session')
  })

  test('updatePolicy makes the new policy authoritative for the rest of the response', () => {
    request.state[cookieNamePolicy] = JSON.stringify({ confirmed: true, essential: true, analytics: true })

    cookiesModule.updatePolicy(request, h, false)

    expect(cookiesModule.getCurrentPolicy(request)).toStrictEqual({
      confirmed: true,
      essential: true,
      analytics: false
    })
  })

  test('getCurrentPolicy falls back to the request cookie when no policy has been written', () => {
    request.state[cookieNamePolicy] = JSON.stringify({ confirmed: true, essential: true, analytics: true })

    expect(cookiesModule.getCurrentPolicy(request)).toStrictEqual({
      confirmed: true,
      essential: true,
      analytics: true
    })
  })
})
