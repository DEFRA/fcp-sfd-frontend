import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { createServer } from '../../../../src/server.js'

describe('Example DAL connection integration route', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  test('example route is registered', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/example'
    })

    const payload = JSON.parse(response.payload)
    console.log(payload)

    expect(response.statusCode).toBe(200)
    expect(payload.message).toContain('success')
    expect(payload.data).not.toBeNull()
  }, 10000)
})
