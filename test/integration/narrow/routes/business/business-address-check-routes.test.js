// Test framework dependencies
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

describe('business address check routes', () => {
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
      // Due to the session cookie being set by the GET route for business
      // address enter we need to hit that page first
      const getResponse = await server.inject({ method: 'GET', url: '/business-details' })
      const cookie = getResponse.headers['set-cookie'][0].split(';')[0] // Extract cookie string

      const response = await server.inject({
        method: 'GET',
        url: '/business-address-check',
        headers: {
          cookie
        }
      })

      expect(response.statusCode).toBe(200)
      expect(response.payload).contain('Check your business address is correct before submitting')
    })
  })

  describe('POST routes', () => {
    describe('when the request succeeds', () => {
      test('it redirects to the /business-details page', async () => {
        // Due to the session cookie being set by the GET route for business
        // address enter we need to hit that page first
        const getResponse = await server.inject({ method: 'GET', url: '/business-details' })
        const cookie = getResponse.headers['set-cookie'][0].split(';')[0] // Extract cookie string

        const response = await server.inject({ method: 'POST', url: '/business-address-check', headers: { cookie } })

        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/business-details')
      })
    })
  })
})
