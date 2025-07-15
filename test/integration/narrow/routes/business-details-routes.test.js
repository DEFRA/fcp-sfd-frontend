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
