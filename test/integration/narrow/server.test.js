import { describe, test, expect, afterEach } from '@jest/globals'
import { createServer } from '../../../src/server.js'

describe('Application Startup Integration Test', () => {
  let server

  afterEach(async () => {
    if (server) {
      await server.stop()
    }
  })

  test('server creates and starts successfully', async () => {
    server = await createServer()
    expect(server).toBeDefined()
    expect(server.info).toBeDefined()

    await server.initialize()
    expect(server.info.created).toBeGreaterThan(0)
    expect(server.info.port).toBe(parseInt(3002))
  })

  test('server has essential functionality', async () => {
    server = await createServer()

    expect(server.views).toBeDefined()
    expect(typeof server.views).toBe('function')
    expect(server.plugins).toBeDefined()
  })
})
