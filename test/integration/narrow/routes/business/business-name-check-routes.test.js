// Test framework dependencies
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

describe('business name check routes', () => {
  let businessNameCheckCookie
  const SERVER_MODULE_PATH = '../../../../../src/server.js'

  const resetAndCreateServer = async () => {
    vi.resetModules()

    const { createServer } = await import(SERVER_MODULE_PATH)

    const server = await createServer()
    await server.initialize()
    return server
  }

  const hookTimeout = 50000

  let server

  beforeEach(async () => {
    vi.clearAllMocks()
    server = await resetAndCreateServer()
  }, hookTimeout)

  afterEach(async () => {
    await server.stop()
  }, hookTimeout)

  describe('GET routes', () => {
    test('when the request succeeds', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/business-name-check'
      })

      expect(response.statusCode).toBe(200)
      expect(response.payload).contain('Check your business name is correct before submitting')
    })
  })

  describe('POST routes', () => {
    describe('when the request succeeds', () => {
      beforeEach(async () => {
        const getResponse = await server.inject({ method: 'GET', url: '/business-name-check' })
        businessNameCheckCookie = getResponse.headers['set-cookie'][0].split(';')[0] // Extract cookie string
      })

      test('it redirects to the /business-name-check page', async () => {
        const response = await server.inject({
          method: 'POST',
          url: '/business-name-check',
          headers: { cookie: businessNameCheckCookie }
        })

        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/business-details')
      })
    })
  })
})
