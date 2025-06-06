import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { createServer } from '../../../../src/server.js'
import { dalConnector } from '../../../../src/dal/connector.js'
import { getSbi } from '../../../../src/dal/queries/get-sbi.js'


const { config } = await import('../../../../src/config/index.js')

describe('Data access layer (DAL) connector integration', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  test('should successfully call DAL and return data', async () => {
    const result = await dalConnector(getSbi, { sbi: 107591843 }, 'test.user11@defra.gov.uk')

    expect(result).toHaveProperty('data')
    expect(result.data).toHaveProperty('business')
    expect(result.data.business).toHaveProperty('sbi')
    expect(result.data.business.sbi).toBe('107591843')
  }, 10000)

    test('should handle network errors by setting config directly', async () => {
  
  
  const originalEndpoint = config.get('dalConfig.endpoint')
  
  try {
    config.set('dalConfig.endpoint', 'http://nonexistent-domain-12345.invalid/graphql')
    
    await expect(dalConnector(getSbi, { sbi: 107591843 }, 'test.user11@defra.gov.uk'))
      .rejects.toThrow()
  } finally {
    config.set('dalConfig.endpoint', originalEndpoint)
  }
}, 15000)
})
