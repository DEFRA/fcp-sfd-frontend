import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { createServer } from '../../../../src/server.js'

let originalDalEndpoint = process.env.DAL_ENDPOINT

describe('Example DAL connection integration route', () => {
  let server

  beforeAll(async () => {
    originalDalEndpoint = process.env.DAL_ENDPOINT
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
    process.env.DAL_ENDPOINT = originalDalEndpoint
  })

  test('example route is registered', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/example'
    })

    const payload = JSON.parse(response.payload)
    console.log(response)

    expect(response.statusCode).toBe(200)
    expect(payload.message).toContain('success')
    expect(payload.data).not.toBeNull()
  }, 10000)

  test('should handle error with invalid email via query params', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/example?email=invalid.email.format'
    })

    const payload = JSON.parse(response.payload)
    if (response.statusCode === 500) {
      expect(payload.error).toBe('Failed to fetch data')
    }
  }, 10000)
})
