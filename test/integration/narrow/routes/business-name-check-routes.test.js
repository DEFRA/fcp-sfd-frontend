import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest'

describe('business name check routes', () => {
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
      test('business name check route responds correctly', async () => {
        const response = await server.inject({
          method: 'GET',
          url: '/business-name-check'
        })

        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toContain('text/html')
      })
    })

    describe('POST routes', () => {
      test('business name check POST route is registered', async () => {
        const response = await server.inject({
          method: 'POST',
          url: '/business-name-check'
        })

        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/business-details')
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

    test('should still allow business name check functionality', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/business-name-check'
      })

      expect(response.statusCode).toBe(200)
      expect(response.payload).toContain('Check your business name is correct before submitting')
    })
  })
})
