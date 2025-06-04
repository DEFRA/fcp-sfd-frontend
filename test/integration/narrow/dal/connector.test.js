import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest'
import { createServer } from '../../../../src/server.js'
import { dalConnector } from '../../../../src/dal/connector.js'

const originalDalEndpoint = process.env.DAL_ENDPOINT
const originalFetch = global.fetch

const query = `
query Business {
  business(sbi: 123456789) {
    sbi
  }
}
`

describe('Data access layer (DAL) connector integration', () => {
  let server

  beforeAll(async () => {
    global.fetch = vi.fn(async (url, options) => {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            business: {
              sbi: 123456789
            }
          }
        })
      }
    })

    process.env.DAL_ENDPOINT = 'http://fcp-dal-api:3005/graphql'

    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()

    process.env.DAL_ENDPOINT = originalDalEndpoint
    global.fetch = originalFetch
  })

  test('should successfully call DAL and return data', async () => {
    const result = await dalConnector(query, 'mockemail@test.com')

    const [url, options] = global.fetch.mock.calls[0]

    expect(url).toBe('http://fcp-dal-api:3005/graphql')
    expect(options.headers.email).toBe('mockemail@test.com')

    expect(result).toEqual({
      data: {
        business: {
          sbi: 123456789
        }
      }
    })
  })

  test('should throw and log error if DAL connection is not successful', async () => {
    const error = 'Network error'
    global.fetch.mockRejectedValueOnce(new Error(error))

    await expect(dalConnector(query, 'mockemail@test.com')).rejects.toThrow('Network error')
  })
})
