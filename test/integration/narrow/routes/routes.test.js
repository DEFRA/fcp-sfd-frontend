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

    test('cookies route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/cookies'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test('home route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/'
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

    test('business-name-change route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/business-name-change'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test('business-name-check route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/business-name-check'
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

    test('business-address-enter route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/business-address-enter'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test('business-address-enter route responds correctly', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/business-address-check'
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
