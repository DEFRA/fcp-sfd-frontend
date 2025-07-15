import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest'
import { BUSINESS_NAME_MAX } from '../../../../src/constants/validation-fields.js'

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
    vi.clearAllMocks()
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
        ['change business legal status', '/business-legal-status-change'],
        ['change business type', '/business-type-change']
      ])('%s GET route responds correctly', async (_, url) => {
        const options = {
          method: 'GET',
          url
        }
        const response = await server.inject(options)

        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toContain('text/html')
      })
    })

    describe('POST routes', () => {
      test.each([
        [
          'change business name',
          '/business-name-change',
          {
            businessName: 'Test Farms Ltd'
          }
        ]
      ])('%s POST route is registered', async (_, url, payload) => {
        const response = await server.inject({
          method: 'POST',
          url,
          payload
        })

        expect(response.statusCode).toBe(302)
      })
    })

    describe('schema validation: business name', () => {
      test.each([
        [
          'no business name provided',
          {
            businessName: ''
          },
          'Enter business name'
        ],
        [
          'business name is too long',
          {
            businessName: 'a'.repeat(BUSINESS_NAME_MAX + 1)
          },
          `Business name must be ${BUSINESS_NAME_MAX} characters or less`
        ]
      ])('%s returns 400 and expected error message', async (_, payload, errorMessage) => {
        const response = await server.inject({
          method: 'POST',
          url: '/business-name-change',
          payload
        })

        expect(response.statusCode).toBe(400)
        expect(response.payload).toContain(errorMessage)
      })
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