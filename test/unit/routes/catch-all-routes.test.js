// Test framework dependencies
import { vi, beforeEach, describe, test, expect } from 'vitest'

// Thing under test
import { catchAllNotFound } from '../../../src/routes/catch-all-routes.js'

describe('catchAllNotFound route', () => {
  let request
  let h

  beforeEach(() => {
    vi.clearAllMocks()
    request = {
      path: '/some/random/path',
      method: 'GET',
      headers: {}
    }

    h = {
      view: vi.fn().mockReturnValue({
        code: vi.fn().mockReturnThis()
      })
    }
  })

  test('should match all HTTP methods', () => {
    expect(catchAllNotFound.method).toBe('*')
  })

  test('should match any unmatched path', () => {
    expect(catchAllNotFound.path).toBe('/{any*}')
  })

  test('should try to authenticate using session strategy', () => {
    expect(catchAllNotFound.options.auth.strategy).toBe('session')
    expect(catchAllNotFound.options.auth.mode).toBe('try')
  })

  test('should have a handler function', () => {
    expect(catchAllNotFound.handler).toBeInstanceOf(Function)
  })

  describe('handler', () => {
    test('should render the page-not-found view with a 404 status code', async () => {
      await catchAllNotFound.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('errors/page-not-found')
      expect(h.view().code).toHaveBeenCalledWith(404)
    })

    test('should work for different HTTP methods', async () => {
      request.method = 'POST'
      await catchAllNotFound.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('errors/page-not-found')
      expect(h.view().code).toHaveBeenCalledWith(404)
    })
  })
})
