// test/integration/narrow/routes/errors/index.test.js
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import Hapi from '@hapi/hapi'

// Import the actual errors array - not mocked
import { errors } from '../../../../../src/routes/errors/index.js'

describe('Error Routes Registration', () => {
  let server

  beforeEach(async () => {
    // Create a real server for testing routes
    server = Hapi.server()

    // Register vision for template rendering
    await server.register([
      await import('@hapi/vision')
    ])

    // Set up view engine (simplified for testing)
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

    // Register the actual error routes we're testing
    server.route(errors)

    // Initialize the server
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('errors module exports expected routes', () => {
    // Test that errors is an array
    expect(Array.isArray(errors)).toBe(true)

    // Test that errors contains items
    expect(errors.length).toBeGreaterThan(0)

    // Verify route objects have the expected structure
    errors.forEach(route => {
      expect(route).toHaveProperty('method')
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('handler')
    })
  })

  test('service-unavailable route is included in errors array', () => {
    // Find the service-unavailable route by path
    const serviceUnavailableRoute = errors.find(route =>
      route.path === '/service-unavailable'
    )

    // Verify it exists
    expect(serviceUnavailableRoute).toBeDefined()

    // Verify its method is GET
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
    // For each route in errors array, test it responds
    const results = await Promise.all(
      errors.map(route => {
        // For simplicity, we only test GET routes here
        if (route.method === 'GET') {
          return server.inject({
            method: 'GET',
            url: route.path
          })
        }
        return null
      }).filter(Boolean) // Remove nulls for non-GET routes
    )

    // Verify all responses are successful
    results.forEach(response => {
      expect(response.statusCode).toBeGreaterThanOrEqual(200)
      expect(response.statusCode).toBeLessThan(300)
    })
  })
})
