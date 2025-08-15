// Test framework dependencies
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

describe('business legal status change routes', () => {
  const SERVER_MODULE_PATH = '../../../../../src/server.js'

  const resetAndCreateServer = async () => {
    vi.resetModules()

    const { createServer } = await import(SERVER_MODULE_PATH)

    const server = await createServer()
    await server.initialize()
    return server
  }

  const hookTimeout = 50000

  let server

  beforeEach(async () => {
    vi.clearAllMocks()
    server = await resetAndCreateServer()
  }, hookTimeout)

  afterEach(async () => {
    await server.stop()
  }, hookTimeout)

  describe('GET routes', () => {
    test('when the request succeeds', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/business-legal-status-change'
      })

      expect(response.statusCode).toBe(200)
      expect(response.payload).toContain('Change your legal status')
    })
  })
})
