import { constants } from 'http2'
import { vi, beforeAll, afterAll, describe, test, expect } from 'vitest'
import '../../../mocks/setup-server-mocks.js'

const { HTTP_STATUS_OK } = constants

const { createServer } = await import('../../../../src/server')

let server

describe('index route', () => {
  beforeAll(async () => {
    vi.clearAllMocks()

    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    if (server) {
      await server.stop()
    }
  })

  test('GET / returns index view', async () => {
    const response = await server.inject({
      url: '/'
    })
    expect(response.statusCode).toBe(HTTP_STATUS_OK)
    expect(response.request.response.source.template).toBe('index')
  })
})
