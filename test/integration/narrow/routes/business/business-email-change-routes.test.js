// Test framework dependencies
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

describe('business email change routes', () => {
  let businessEmailChangeCookie
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
        url: '/business-email-change'
      })

      expect(response.statusCode).toBe(200)
      expect(response.payload).contain('What is your business email address?')
    })
  })

  describe('POST routes', () => {
    describe('when the request succeeds', () => {
      beforeEach(async () => {
        const getResponse = await server.inject({ method: 'GET', url: '/business-email-change' })
        businessEmailChangeCookie = getResponse.headers['set-cookie'][0].split(';')[0] // Extract cookie string
      })

      test('it redirects to the /business-email-check page', async () => {
        const response = await server.inject({
          method: 'POST',
          url: '/business-email-change',
          payload: { businessEmail: 'example@email.com' },
          headers: { cookie: businessEmailChangeCookie }
        })

        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/business-email-check')
      })

      describe('and the validation fails', () => {
        test('it returns the page successfully with the error summary banner', async () => {
          const response = await server.inject({
            method: 'POST',
            url: '/business-email-change',
            payload: { businessEmail: 'bad email' },
            headers: { cookie: businessEmailChangeCookie }
          })

          expect(response.statusCode).toBe(400)
          expect(response.payload).contain('What is your business email address?')
          expect(response.payload).toContain('There is a problem')
        })
      })
    })
  })
})
