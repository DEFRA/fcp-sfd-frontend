import { vi, beforeEach, describe, test, expect } from 'vitest'
import { getCurrentPolicy, updatePolicy } from '../../../../src/cookies.js'
import { cookiesPresenter } from '../../../../src/presenters/footer/cookies-presenter.js'
import { cookies } from '../../../../src/routes/footer/cookies-routes.js'

const [getCookies, postCookies] = cookies

vi.mock('../../../../src/cookies.js', () => ({
  getCurrentPolicy: vi.fn(),
  updatePolicy: vi.fn()
}))

vi.mock('../../../../src/presenters/footer/cookies-presenter.js', () => ({
  cookiesPresenter: vi.fn()
}))

describe('Cookies endpoints', () => {
  let viewMock
  let responseMock

  beforeEach(() => {
    vi.clearAllMocks()

    viewMock = vi.fn().mockReturnValue('mock view return')
    responseMock = vi.fn().mockReturnValue('mock response return')
  })

  describe('GET /cookies', () => {
    test('should have the correct method and path', () => {
      expect(getCookies.method).toBe('GET')
      expect(getCookies.path).toBe('/cookies')
    })

    test('should render the cookies view with the current policy', () => {
      const mockRequest = {
        headers: { referer: '/some-previous-page' }
      }
      const h = { view: viewMock }
      const cookiesPolicy = { confirmed: true, analytics: true }
      const presenterResult = { analytics: {}, updated: false, referer: '/some-previous-page' }

      getCurrentPolicy.mockReturnValue(cookiesPolicy)
      cookiesPresenter.mockReturnValue(presenterResult)

      const result = getCookies.handler(mockRequest, h)

      expect(getCurrentPolicy).toHaveBeenCalledWith(mockRequest, h)
      expect(cookiesPresenter).toHaveBeenCalledWith(false, '/some-previous-page', cookiesPolicy)
      expect(viewMock).toHaveBeenCalledWith('cookies', {
        pageTitle: 'Cookies',
        heading: 'How we use cookies to store information about how you use this service.',
        backLink: '/some-previous-page',
        ...presenterResult
      })
      expect(result).toBe('mock view return')
    })
  })

  describe('POST /cookies', () => {
    test('should have the correct method and path', () => {
      expect(postCookies.method).toBe('POST')
      expect(postCookies.path).toBe('/cookies')
    })

    test('should validate the payload', () => {
      expect(postCookies.options.validate.payload).toBeDefined()
    })

    test('should update the policy and return a success response for async requests', () => {
      const mockRequest = {
        payload: { analytics: true, async: true, referer: '/some-page' }
      }
      const h = { response: responseMock, view: viewMock }

      const result = postCookies.handler(mockRequest, h)

      expect(updatePolicy).toHaveBeenCalledWith(mockRequest, h, true)
      expect(responseMock).toHaveBeenCalledWith({ message: 'success' })
      expect(viewMock).not.toHaveBeenCalled()
      expect(result).toBe('mock response return')
    })

    test('should update the policy and re-render the cookies view for non-async requests', () => {
      const mockRequest = {
        payload: { analytics: false, async: false, referer: '/some-page' }
      }
      const h = { response: responseMock, view: viewMock }
      const cookiesPolicy = { confirmed: true, analytics: false }
      const presenterResult = { analytics: {}, updated: true, referer: '/some-page' }

      getCurrentPolicy.mockReturnValue(cookiesPolicy)
      cookiesPresenter.mockReturnValue(presenterResult)

      const result = postCookies.handler(mockRequest, h)

      expect(updatePolicy).toHaveBeenCalledWith(mockRequest, h, false)
      expect(getCurrentPolicy).toHaveBeenCalledWith(mockRequest, h)
      expect(cookiesPresenter).toHaveBeenCalledWith(true, '/some-page', cookiesPolicy)
      expect(viewMock).toHaveBeenCalledWith('cookies', {
        pageTitle: 'Cookies',
        heading: 'How we use cookies to store information about how you use this service.',
        backLink: '/some-page',
        ...presenterResult
      })
      expect(responseMock).not.toHaveBeenCalled()
      expect(result).toBe('mock view return')
    })
  })
})
