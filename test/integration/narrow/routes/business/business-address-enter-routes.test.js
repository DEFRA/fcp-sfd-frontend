// Test framework dependencies
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

describe('business address enter routes', () => {
  let businessDetailsCookie
  let businessAddressEnterCookie
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

    // To set the session we need to hit the business details page first
    const getResponse = await server.inject({ method: 'GET', url: '/business-details' })
    businessDetailsCookie = getResponse.headers['set-cookie'][0].split(';')[0] // Extract cookie string
  }, hookTimeout)

  afterEach(async () => {
    await server.stop()
  }, hookTimeout)

  describe('GET routes', () => {
    test('when the request succeeds', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/business-address-enter',
        headers: {
          cookie: businessDetailsCookie
        }
      })

      expect(response.statusCode).toBe(200)
      expect(response.payload).contain('Enter your business address')
    })
  })

  describe('POST routes', () => {
    describe('when the request succeeds', () => {
      beforeEach(async () => {
        const getResponse = await server.inject({ method: 'GET', url: '/business-address-enter', headers: { cookie: businessDetailsCookie }})
        businessAddressEnterCookie = getResponse.headers['set-cookie'][0].split(';')[0] // Extract cookie string
      })

      test('it redirects to the /business-address-check page', async () => {
        const response = await server.inject({
          method: 'POST',
          url: '/business-address-enter',
          payload: {
            address1: 'New address 1',
            address2: '',
            city: 'Sandford',
            county: '',
            postcode: 'SK22 1DL',
            country: 'United Kingdom'
          },
          headers: {
            cookie: businessAddressEnterCookie
          }
        })

        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/business-address-check')
      })

      describe('and the validation fails', () => {
        test('it returns the page successfully with the error summary banner', async () => {
          const response = await server.inject({
            method: 'POST',
            url: '/business-address-enter',
            payload: {
              address2: '',
              city: 'Sandford',
              county: '',
              postcode: 'SK22 1DL',
              country: 'United Kingdom'
            },
            headers: {
              cookie: businessAddressEnterCookie
            }
          })

          expect(response.statusCode).toBe(400)
          expect(response.payload).contain('Enter your business address')
          expect(response.payload).toContain('There is a problem')
        })
      })
    })
  })
})
