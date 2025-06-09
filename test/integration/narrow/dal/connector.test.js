import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { createServer } from '../../../../src/server.js'
import { dalConnector } from '../../../../src/dal/connector.js'
import { getSbiInfo } from '../../../../src/dal/queries/get-sbi-info.js'

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

  test('should successfully call DAL and return data when email header is present', async () => {
    const result = await dalConnector(getSbiInfo, { sbi: 107591843 }, 'test.user11@defra.gov.uk')

    expect(result).toHaveProperty('data')
    expect(result.data).toHaveProperty('business')
    expect(result.data.business).toHaveProperty('sbi')
    expect(result.data.business.sbi).toBe('107591843')
  })

  test('should throw error when email header is not present', async () => {
    await expect(dalConnector(getSbiInfo, { sbi: 107591843 }))
      .rejects.toThrow('DAL connection cannot be made if email header is missing')
  })

  test('should handle network errors by setting config directly', async () => {
    const originalEndpoint = config.get('dalConfig.endpoint')

    try {
      config.set('dalConfig.endpoint', 'http://nonexistent-domain-12345.invalid/graphql')

      await expect(dalConnector(getSbiInfo, { sbi: 107591843 }, 'test.user11@defra.gov.uk'))
        .rejects.toThrow()
    } finally {
      config.set('dalConfig.endpoint', originalEndpoint)
    }
  })
})
