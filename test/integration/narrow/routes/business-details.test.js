import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest'

describe('business details', () => {
  const originalEnv = process.env.ALLOW_ERROR_VIEWS

  const SERVER_MODULE_PATH = '../../../../src/server.js'

  const resetAndCreateServer = async () => {
    vi.resetModules()

    const { createServer } = await import(SERVER_MODULE_PATH)

    const server = await createServer()
    await server.initialize()
    return server
  }

  let server

  beforeEach(async () => {
    server = await resetAndCreateServer()
  })

  afterEach(async () => {
    await server.stop()
  })

  describe('with error views enabled', () => {
    beforeAll(() => {
      process.env.ALLOW_ERROR_VIEWS = 'true'
    })

    describe('GET routes', () => {
      test('health route responds correctly', async () => {
        const response = await server.inject({
          method: 'GET',
          url: '/health'
        })

        expect(response.statusCode).toBe(200)
      })

      test.each([
        ['home', '/'],
        ['cookies', '/cookies'],
        ['service unavailable', '/service-unavailable'],
        ['page not found', '/page-not-found'],
        ['service problem', '/service-problem'],
        ['business details', '/business-details'],
        ['change business name', '/business-name-change'],
        ['check business name', '/business-name-check'],
        ['enter business address', '/business-address-enter'],
        ['check business address', '/business-address-check'],
        ['change business phone numbers', '/business-phone-numbers-change'],
        ['check business phone numbers', '/business-phone-numbers-check'],
        ['change business email', '/business-email-change'],
        ['check business email', '/business-email-check'],
        ['change business legal status', '/business-legal-status-change'],
        ['change business type', '/business-type-change']
      ])('%s route responds correctly', async (_, url) => {
        const response = await server.inject({ method: 'GET', url })

        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toContain('text/html')
      })
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

    test('business-email-change POST returns 400 on empty email', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/business-email-change',
        payload: {
          businessEmail: ''
        }
      })

      expect(response.statusCode).toBe(400)
      expect(response.payload).toContain('Enter business email address')
    })

    test('business-email-change POST returns 400 on invalid email format', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/business-email-change',
        payload: {
          businessEmail: 'not-an-email'
        }
      })

      expect(response.statusCode).toBe(400)
      expect(response.payload).toContain('Enter an email address, like name@example.com')
    })
  })

  describe('with error views disabled', () => {
    beforeAll(() => {
      process.env.ALLOW_ERROR_VIEWS = 'false'
    })

    afterAll(() => {
      if (originalEnv === undefined) {
        delete process.env.ALLOW_ERROR_VIEWS
      } else {
        process.env.ALLOW_ERROR_VIEWS = originalEnv
      }
    })

    test.each([
      ['home', '/'],
      ['service problem', '/contact-help']
    ])('%s route responds correctly', async (_, url) => {
      const response = await server.inject({ method: 'GET', url })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test.each([
      ['page not found', '/page-not-found'],
      ['service unavailable', '/service-unavailable'],
      ['service problem', '/service-problem']
    ])('%s route returns 404 when disabled', async (_, url) => {
      const response = await server.inject({ method: 'GET', url })

      expect(response.statusCode).toBe(404)
    })
  })
})
