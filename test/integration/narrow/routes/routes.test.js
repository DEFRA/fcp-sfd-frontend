import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll, jest } from '@jest/globals'

describe('Routes Integration Tests', () => {
  const originalEnv = process.env.ALLOW_ERROR_VIEWS

  const SERVER_MODULE_PATH = '../../../../src/server.js'

  const resetAndCreateServer = async () => {
    jest.resetModules()

    const { createServer } = await import(SERVER_MODULE_PATH)

    const server = await createServer()
    await server.initialize()
    return server
  }

  describe('With Error Views Enabled', () => {
    let server

    beforeAll(() => {
      process.env.ALLOW_ERROR_VIEWS = 'true'
    })

    beforeEach(async () => {
      server = await resetAndCreateServer()
    })

    afterEach(async () => {
      await server.stop()
    })

    test('home route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test('cookies route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/cookies'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test('health route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/health'
      })

      expect(response.statusCode).toBe(200)
    })

    test('service-unavailable route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/service-unavailable'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test('page-not-found route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/page-not-found'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test('service-problem route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/service-problem'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test('business-details route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/business-details'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test('business-name-change GET route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/business-name-change'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test('business-name-change POST route is registered', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/business-name-change',
        payload: {
          businessName: 'Test Business'
        }
      })

      expect(response.statusCode).toBe(302)
    })

    test('business-name-check route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/business-name-check'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test('business-address-enter GET route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/business-address-enter'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test('business-address-enter POST route is registered', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/business-address-enter',
        payload: {
          address1: '10 Skirbeck Way',
          address2: '',
          addressCity: 'Maidstone',
          addressCounty: '',
          addressPostcode: 'SK22 1DL',
          addressCountry: 'United Kingdom'
        }
      })

      expect(response.statusCode).toBe(302)
    })

    test('business-address-check route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/business-address-check'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test('business-phone-numbers-change GET route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/business-phone-numbers-change'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test('business-phone-numbers-change POST route is registered', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/business-phone-numbers-change',
        payload: {
          businessTelephone: '01234567890',
          businessMobile: '09876543210'
        }
      })

      expect(response.statusCode).toBe(302)
    })

    test('business-phone-numbers-check route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/business-phone-numbers-check'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test('business-email-change GET route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/business-email-change'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test('business-email-change POST route is registered', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/business-email-change',
        payload: {
          businessEmail: 'name@example.com'
        }
      })

      expect(response.statusCode).toBe(302)
    })

    test('business-email-check route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/business-email-check'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })
  })

  describe('With Error Views Disabled', () => {
    let server

    beforeAll(() => {
      process.env.ALLOW_ERROR_VIEWS = 'false'
    })

    beforeEach(async () => {
      server = await resetAndCreateServer()
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

    test('home route still responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test('service-unavailable route returns 404 when disabled', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/service-unavailable'
      })

      expect(response.statusCode).toBe(404)
    })

    test('page-not-found route returns 404 when disabled', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/page-not-found'
      })

      expect(response.statusCode).toBe(404)
    })

    test('service-problem route returns 404 when disabled', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/service-problem'
      })

      expect(response.statusCode).toBe(404)
    })

    test('service-problem route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/contact-help'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })
  })
})
