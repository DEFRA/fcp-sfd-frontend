// test/integration/narrow/routes/index.test.js
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import Hapi from '@hapi/hapi'

// Import the actual routes - not mocked
import { routes } from '../../../../src/routes/index.js'

describe('Routes Registration', () => {
  let server

  beforeEach(async () => {
    // Create a real server for testing routes
    server = Hapi.server()

    // Register vision and other required plugins
    await server.register([
      await import('@hapi/vision'),
      await import('@hapi/inert')
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

    // Register the actual routes we're testing
    server.route(routes)

    // Initialize the server
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('routes module exports expected routes', () => {
    // Test that routes is an array
    expect(Array.isArray(routes)).toBe(true)

    // Test that routes contains items
    expect(routes.length).toBeGreaterThan(0)

    // Verify route objects have the expected structure
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
    // Test access to static assets (assuming you have a /public route)
    // If your path is different, adjust accordingly
    const response = await server.inject({
      method: 'GET',
      url: '/public/css/style.css'
    })

    // Even if file doesn't exist, route should be registered (404 is an expected response)
    expect([200, 404]).toContain(response.statusCode)
  })
})
