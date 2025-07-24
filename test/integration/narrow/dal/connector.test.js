import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { createServer } from '../../../../src/server.js'
import { dalConnector } from '../../../../src/dal/connector.js'
import { exampleQuery } from '../../../../src/dal/queries/example-query.js'

const { config } = await import('../../../../src/config/index.js')

describe('Data access layer (DAL) connector integration', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    // await server.initialize()
  })

  afterAll(async () => {
    if (server) {
      await server.stop()
    }
  })

  test('should successfully call DAL and return data when email header is present', async () => {
    const result = await dalConnector(
      exampleQuery,
      {
        sbi: '107591843',
        crn: '9477368292'
      },
      'test.user11@defra.gov.uk'
    )

    expect(result.data).toBeDefined()
    expect(result.errors).toBeNull()
    expect(result.statusCode).toBe(200)
  })

  test('should return error when email header is missing', async () => {
    const result = await dalConnector(exampleQuery, { sbi: 107591843 })

    expect(result.data).toBeNull()
    expect(result.statusCode).toBe(400)
    expect(result.errors).toBeDefined()
    expect(result.errors[0].message).toBe('DAL connection cannot be made if email header is missing')
  })

  test('should handle network errors by setting config directly', async () => {
    const originalEndpoint = config.get('dalConfig.endpoint')

    try {
      config.set('dalConfig.endpoint', 'http://nonexistent-domain-12345.invalid/graphql')

      const result = await dalConnector(exampleQuery, { sbi: 107591843 }, 'test.user11@defra.gov.uk')

      expect(result.data).toBeNull()
      expect(result.errors).toBeDefined()
      expect(result).toHaveProperty('statusCode', 500)
    } finally {
      config.set('dalConfig.endpoint', originalEndpoint)
    }
  })

  test('should handle invalid GraphQL query syntax as bad request (400) error', async () => {
    const invalidQuery = `
      query Business($sbi: ID!) {
        business(sbi: $sbi) {
          sbi
          invalidSyntax {{{
      }
    `

    const result = await dalConnector(invalidQuery, { sbi: 107591843 }, 'test.user11@defra.gov.uk')

    expect(result.data).toBeNull()
    expect(result.errors).toBeDefined()
    expect(result.errors[0].message).toBe('Syntax Error: Expected Name, found "{".')
    expect(result.statusCode).toBe(400)
  })

  test('should handle missing required query params as bad request (400) error', async () => {
    const result = await dalConnector(exampleQuery, {}, 'test.user11@defra.gov.uk')

    expect(result.data).toBeNull()
    expect(result.errors).toBeDefined()
    expect(result.errors[0].message).toBe('Variable "$sbi" of required type "ID!" was not provided.')
    expect(result.statusCode).toBe(400)
  })
})
