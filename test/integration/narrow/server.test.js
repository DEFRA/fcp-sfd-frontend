import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { createServer } from '../../../src/server.js'
import { config } from '../../../src/config/config.js'

describe('Application Startup Integration Test', () => {
  let server
  let originalPort

  beforeEach(async () => {
    originalPort = config.get('port')
    config.set('port', '3456')
  })

  afterEach(async () => {
    config.set('port', originalPort)
    if (server) {
      await server.stop()
    }
  })

  test('server creates and starts successfully', async () => {
    server = await createServer()
    expect(server).toBeDefined()
    expect(server.info).toBeDefined()

    await server.start()
    expect(server.info.started).toBeGreaterThan(0)
    expect(server.info.port).toBe(parseInt(config.get('port')))
  })

  test('server has essential functionality', async () => {
    server = await createServer()

    expect(server.views).toBeDefined()
    expect(typeof server.views).toBe('function')
    expect(server.plugins).toBeDefined()
  })

  test('server handles requests after startup', async () => {
    server = await createServer()
    await server.start()

    const response = await server.inject({
      method: 'GET',
      url: '/health'
    })

    expect(response.statusCode).toBe(200)
  })
})
