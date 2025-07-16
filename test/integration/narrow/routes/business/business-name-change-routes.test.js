// Test framework dependencies
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

describe('business name change routes', () => {
  let businessNameChangeCookie
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
        url: '/business-name-change'
      })

      expect(response.statusCode).toBe(200)
      expect(response.payload).contain('What is your business name?')
    })
  })

  describe('POST routes', () => {
    describe('when the request succeeds', () => {
      beforeEach(async () => {
        const getResponse = await server.inject({ method: 'GET', url: '/business-name-change' })
        businessNameChangeCookie = getResponse.headers['set-cookie'][0].split(';')[0] // Extract cookie string
      })

      test('it redirects to the /business-name-check page', async () => {
        const response = await server.inject({
          method: 'POST',
          url: '/business-name-change',
          payload: { businessName: 'New business name ltd' },
          headers: { cookie: businessNameChangeCookie }
        })

        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/business-name-check')
      })

      describe('and the validation fails', () => {
        test('it returns the page successfully with the error summary banner', async () => {
          const response = await server.inject({
            method: 'POST',
            url: '/business-name-change',
            payload: { businessName: '' },
            headers: { cookie: businessNameChangeCookie }
          })

          expect(response.statusCode).toBe(400)
          expect(response.payload).contain('What is your business name?')
          expect(response.payload).toContain('There is a problem')
        })
      })
    })
  })
})
