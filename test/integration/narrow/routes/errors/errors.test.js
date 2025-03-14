import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { createServer } from '../../../../../src/server.js'
import { errors } from '../../../../../src/routes/errors/index.js'

describe('Error Routes Integration Test', () => {
  let server

  beforeEach(async () => {
    server = await createServer()
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

  test('service-unavailable route responds correctly on the server', async () => {
    const table = server.table()
    const serviceUnavailableRoute = table.find(route =>
      route.path === '/service-unavailable' && route.method === 'get'
    )
    expect(serviceUnavailableRoute).toBeDefined()
    const response = await server.inject({
      method: 'GET',
      url: '/service-unavailable'
    })
    expect(response.statusCode).toBe(200)
    expect(response.payload).toBeTruthy()
    expect(response.payload.length).toBeGreaterThan(0)
    if (response.headers['content-type'] && response.headers['content-type'].includes('text/html')) {
      expect(response.payload).toContain('Service Unavailable | Single Front Door')
      expect(response.payload).toMatch(/<title>[\s\S]*Service Unavailable \| Single Front Door[\s\S]*<\/title>/)
    }
  })

  test('all error routes respond with 2xx status codes on the server', async () => {
    const errorPaths = errors
      .filter(route => route.method === 'GET')
      .map(route => route.path)
    const results = await Promise.all(
      errorPaths.map(path =>
        server.inject({
          method: 'GET',
          url: path
        })
      )
    )

    results.forEach(response => {
      expect(response.statusCode).toBeGreaterThanOrEqual(200)
      expect(response.statusCode).toBeLessThan(300)
      expect(response.payload).toBeTruthy()
      expect(response.payload.length).toBeGreaterThan(0)
    })
  })
})
