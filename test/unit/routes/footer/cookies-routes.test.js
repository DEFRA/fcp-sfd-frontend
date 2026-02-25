import { vi, beforeEach, describe, test, expect } from 'vitest'
import { cookies } from '../../../../src/routes/footer/cookies-routes.js'

describe('Cookies endpoint', () => {
  let viewMock

  beforeEach(() => {
    viewMock = vi.fn().mockReturnValue('mock view return')
    vi.clearAllMocks()
  })

  test('should have the correct method and path', () => {
    expect(cookies.method).toBe('GET')
    expect(cookies.path).toBe('/cookies')
  })

  test('should render the cookies view with correct data', () => {
    const mockRequest = {
      headers: {
        referer: '/some-previous-page'
      }
    }

    const h = { view: viewMock }

    const result = cookies.handler(mockRequest, h)

    expect(viewMock).toHaveBeenCalledWith('cookies', {
      pageTitle: 'Cookies',
      heading: 'How we use cookies to store information about how you use this service.',
      backLink: '/some-previous-page'
    })

    expect(result).toBe('mock view return')
  })
})
