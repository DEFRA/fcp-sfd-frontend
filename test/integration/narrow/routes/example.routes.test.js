import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest'
import { createServer } from '../../../../src/server.js'

vi.mock('../../../../src/dal/connector.js', () => {
  return {
    dalConnector: vi.fn().mockResolvedValue({
      data: {
        business: {
          sbi: '123456789'
        }
      }
    })
  }
})

describe('Example DAL connection integration route', () => {
  const originalEnv = process.env.ALLOW_ERROR_VIEWS
  const hookTimeout = 50000
  let server

  const resetAndCreateServer = async () => {
    const server = await createServer()
    await server.initialize()
    return server
  }

  beforeAll(() => {
    process.env.ALLOW_ERROR_VIEWS = 'true'
  })

  afterAll(() => {
    if (originalEnv === undefined) {
      delete process.env.ALLOW_ERROR_VIEWS
    } else {
      process.env.ALLOW_ERROR_VIEWS = originalEnv
    }
  })

  beforeEach(async () => {
    server = await resetAndCreateServer()
  }, hookTimeout)

  afterEach(async () => {
    await server.stop()
  }, hookTimeout)

  test('example route responds with success message', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/example'
    })

    expect(response.statusCode).toBe(200)
    expect(response.result).toEqual({ message: 'success' })
  })
})
