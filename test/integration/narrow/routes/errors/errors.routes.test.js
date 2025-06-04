import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest'

describe('Error Routes Registration', () => {
  const originalEnv = process.env.ALLOW_ERROR_VIEWS
  const SERVER_MODULE_PATH = '../../../../../src/server.js'
  const ERRORS_MODULE_PATH = '../../../../../src/routes/errors/index.routes.js'

  describe('With Error Views Enabled', () => {
    const hookTimeout = 50000

    let server
    let errors

    beforeAll(() => {
      process.env.ALLOW_ERROR_VIEWS = 'true'
    })

    beforeEach(async () => {
      vi.resetModules()

      const errorsModule = await import(ERRORS_MODULE_PATH)
      errors = errorsModule.errors

      const { createServer } = await import(SERVER_MODULE_PATH)
      server = await createServer()
      await server.initialize()
    }, hookTimeout)

    afterEach(async () => {
      await server.stop()
    }, hookTimeout)

    test('service-unavailable route is included in errors array', () => {
      const serviceUnavailableRoute = errors.find(route =>
        route.path === '/service-unavailable'
      )

      expect(serviceUnavailableRoute).toBeDefined()
      expect(serviceUnavailableRoute.method).toBe('GET')
    })

    test('page-not-found route is included in errors array', () => {
      const pageNotFoundRoute = errors.find(route =>
        route.path === '/page-not-found'
      )

      expect(pageNotFoundRoute).toBeDefined()
      expect(pageNotFoundRoute.method).toBe('GET')
    })

    test('service-problem route is included in errors array', () => {
      const serviceProblemRoute = errors.find(route =>
        route.path === '/service-problem'
      )

      expect(serviceProblemRoute).toBeDefined()
      expect(serviceProblemRoute.method).toBe('GET')
    })
  })

  describe('With Error Views Disabled', () => {
    let server
    let errors

    beforeAll(() => {
      process.env.ALLOW_ERROR_VIEWS = 'false'
    })

    beforeEach(async () => {
      vi.resetModules()

      const errorsModule = await import(ERRORS_MODULE_PATH)
      errors = errorsModule.errors

      const { createServer } = await import(SERVER_MODULE_PATH)
      server = await createServer()
      await server.initialize()
    })

    afterEach(async () => {
      await server.stop()
    })

    afterAll(() => {
      if (originalEnv === undefined) {
        delete process.env.ALLOW_ERROR_VIEWS
      } else {
        process.env.ALLOW_ERROR_VIEWS = originalEnv
      }
    })

    test('errors array should be empty when error views are disabled', () => {
      expect(errors).toEqual([])
    })
  })
})
