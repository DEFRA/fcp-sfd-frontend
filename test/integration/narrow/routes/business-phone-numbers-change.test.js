import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest'
import { createServer } from '../../../../src/server'

describe('/business-phone-numbers-change', () => {
  const url = '/business-phone-numbers-change'
  let server

  describe('when a successful GET request is made ', () => {
    test.only('it responds with a 200 response', async () => {
      server = await createServer()
      await server.initialize()
      // this route working now
      // below not working because the cache isnt set...
      const response = await server.inject({
        method: 'GET',
        url
      })
      expect(response.statusCode).toBe(200)
      await server.stop()
    })

    test('the response includes the page title', () => {

    })
  })

  describe('when the data fetch fails', () => {
    test('it responds with a 500 response', () => {

    })

    test('the page redirect to an error view', () => {

    })
  })

  describe('when a POST request is made ', () => {
    test('it responds with a 200 response', () => {

    })

    test('the response includes the page title', () => {

    })
  })

  // describe('when the user is unauthorised', () => {
  //   test('it responds with a 403 response', () => {
  //     // dont have this setup yet but we should consider this for all our routes
  //   })

  //   test('the page redirects to the sign-in view', () => {
  //     // dont have this setup yet but we should consider this for all our routes
  //   })
  // })
})
