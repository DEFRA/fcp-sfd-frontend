import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import Hapi from '@hapi/hapi'

import { errors } from '../../../../../src/routes/errors/index.js'

describe('Error Routes Registration', () => {
  let server

  beforeEach(async () => {
    server = Hapi.server()

    await server.register([
      await import('@hapi/vision')
    ])

    server.views({
      engines: {
        njk: {
          compile: (src, options) => {
            return (context) => 'Mocked template output'
          }
        }
      },
      path: 'src/views'
    })

    server.route(errors)

    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('errors module exports expected routes', () => {
    expect(Array.isArray(errors)).toBe(true)

    expect(errors.length).toBeGreaterThan(0)

    errors.forEach(route => {
      expect(route).toHaveProperty('method')
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('handler')
    })
  })

  test('service-unavailable route is included in errors array', () => {
    const serviceUnavailableRoute = errors.find(route =>
      route.path === '/service-unavailable'
    )

    expect(serviceUnavailableRoute).toBeDefined()

    expect(serviceUnavailableRoute.method).toBe('GET')
  })

  test('service-unavailable route responds correctly', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/service-unavailable'
    })

    expect(response.statusCode).toBe(200)
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
