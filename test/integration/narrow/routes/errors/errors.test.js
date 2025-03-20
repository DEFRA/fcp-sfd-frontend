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
  test('service-problem route is included in errors array', () => {
    const serviceUnavailableRoute = errors.find(route =>
      route.path === '/errors/service-problem'
    )

    expect(serviceUnavailableRoute).toBeDefined()

    expect(serviceUnavailableRoute.method).toBe('GET')
  })
})
