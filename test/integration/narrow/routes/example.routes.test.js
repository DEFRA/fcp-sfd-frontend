import { describe, test, expect } from 'vitest'
import { createServer } from '../../../../src/server.js'

describe('Example DAL connection integration route', () => {
  test('example route responds with success message and data', async () => {
    const originalEnv = process.env.ALLOW_ERROR_VIEWS
    process.env.ALLOW_ERROR_VIEWS = 'true'

    const server = await createServer()
    await server.initialize()

    const response = await server.inject({
      method: 'GET',
      url: '/example'
    })

    await server.stop()
    if (originalEnv === undefined) {
      delete process.env.ALLOW_ERROR_VIEWS
    } else {
      process.env.ALLOW_ERROR_VIEWS = originalEnv
    }

    expect(response.statusCode).toBe(200)
    expect(response.result).toEqual({
      message: 'success',
      data: expect.any(Object)
    })
  })
})
