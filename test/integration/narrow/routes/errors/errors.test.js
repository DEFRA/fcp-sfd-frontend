import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { createServer } from '../../../../../src/server.js'
import { errors } from '../../../../../src/routes/errors/index.js'

describe('Error Routes Registration', () => {
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('service-unavailable route is included in errors array', () => {
    const serviceUnavailableRoute = errors.find(route =>
      route.path === '/errors/service-unavailable'
    )

    expect(serviceUnavailableRoute).toBeDefined()

    expect(serviceUnavailableRoute.method).toBe('GET')
  })

  test('all error routes respond with 2xx status codes', async () => {
    const results = await Promise.all(
      errors.map(route => {
        if (route.method === 'GET') {
          return server.inject({
            method: 'GET',
            url: route.path
          })
        }
        return null
      }).filter(Boolean)
    )

    results.forEach(response => {
      expect(response.statusCode).toBeGreaterThanOrEqual(200)
      expect(response.statusCode).toBeLessThan(300)
    })
  })
})
