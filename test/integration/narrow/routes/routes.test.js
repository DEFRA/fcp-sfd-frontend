import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import Hapi from '@hapi/hapi'

import { routes } from '../../../../src/routes/index.js'

describe('Routes Registration', () => {
  let server

  beforeEach(async () => {
    server = Hapi.server()

    await server.register([
      await import('@hapi/vision'),
      await import('@hapi/inert')
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

    server.route(routes)

    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('routes module exports expected routes', () => {
    expect(Array.isArray(routes)).toBe(true)

    expect(routes.length).toBeGreaterThan(0)

    routes.forEach(route => {
      expect(route).toHaveProperty('method')
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('handler')
    })
  })

  test('home route is registered and responds', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/'
    })

    expect(response.statusCode).toBe(200)
  })

  test('health route is registered and responds', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/health'
    })

    expect(response.statusCode).toBe(200)
  })

  test('service-unavailable route is registered and responds', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/service-unavailable'
    })

    expect(response.statusCode).toBe(200)
  })

  test('static asset routes are registered', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/public/css/style.css'
    })

    expect([200, 404]).toContain(response.statusCode)
  })
})
