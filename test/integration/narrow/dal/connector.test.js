import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { createServer } from '../../../../src/server.js'
import { dalConnector } from '../../../../src/dal/connector.js'
import { getSbi } from '../../../../src/dal/queries/get-sbi.js'

const originalDalEndpoint = process.env.DAL_ENDPOINT

describe('Data access layer (DAL) connector integration', () => {
  let server

  beforeAll(async () => {
    process.env.DAL_ENDPOINT = 'http://localhost:3005/graphql'
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    process.env.DAL_ENDPOINT = originalDalEndpoint
    await server.stop()
  })

  test('should successfully call DAL and return data', async () => {
    const result = await dalConnector(getSbi, { sbi: 107591843 }, 'test.user11@defra.gov.uk')

    expect(result).toHaveProperty('data')
    expect(result.data).toHaveProperty('business')
    expect(result.data.business).toHaveProperty('sbi')
    expect(result.data.business.sbi).toBe('107591843')
  }, 10000)
})
