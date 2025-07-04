// Test framework dependencies
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

describe('business address enter routes', () => {
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
  let payload

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
      // details we need to hit that page first
      const getResponse = await server.inject({ method: 'GET', url: '/business-details' })
      const cookie = getResponse.headers['set-cookie'][0].split(';')[0] // Extract cookie string

      const response = await server.inject({
        method: 'GET',
        url: '/business-address-enter',
        headers: {
          cookie
        }
      })

      expect(response.statusCode).toBe(200)
      expect(response.payload).contain('Enter your business address')
    })
  })

  describe('POST routes', () => {
    describe('when the request succeeds', () => {
      beforeEach(() => {
        payload = {
          address1: '10 Skirbeck Way',
          address2: 'Lonely Lane',
          city: 'Maidstone',
          county: 'Somerset',
          postcode: 'SK22 1DL',
          country: 'United Kingdom'
        }
      })

      test('it redirects to the /business-address-check page', async () => {
        const response = await server.inject({ method: 'POST', url: '/business-address-enter', payload })

        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/business-address-check')
      })
    })

    describe('when the request succeeds', () => {
      describe('and the validation fails', () => {
        beforeEach(() => {
          payload = {}
        })

        test('it returns the page successfully with the error summary banner', async () => {
          // Due to the session cookie being set by the GET route for business
          // details we need to hit that page first
          const getResponse = await server.inject({ method: 'GET', url: '/business-details' })
          const cookie = getResponse.headers['set-cookie'][0].split(';')[0] // Extract cookie string

          const response = await server.inject({ method: 'POST', url: '/business-address-enter', payload, headers: { cookie } })

          expect(response.statusCode).toBe(400)
          expect(response.payload).toContain('There is a problem')
        })
      })
    })
  })
})
