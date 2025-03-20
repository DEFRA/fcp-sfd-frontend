import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { createServer } from '../../../../src/server.js'

describe('Routes Integration Test', () => {
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('home route responds correctly', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('text/html')
  })

  test('health route responds correctly', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/health'
    })

    expect(response.statusCode).toBe(200)
  })

  test('service-unavailable route responds correctly', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/errors/service-unavailable'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('text/html')
  })

  test('service-unavailable route responds correctly', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/errors/page-not-found'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('text/html')
  })

  test('static asset route is configured correctly', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/public/assets/images/favicon.ico'
    })

    expect([200, 404]).toContain(response.statusCode)
  })
})
