// Test framework dependencies
import { vi, describe, test, expect, beforeAll, afterAll } from 'vitest'

// Thing under test
import { getDalConnector } from '../../../../src/dal/connector.js'
import { exampleQuery } from '../../../../src/dal/queries/example-query.js'

// Setup
import '../../../mocks/setup-server-mocks.js'
import { createServer } from '../../../../src/server.js'

// Mock dependencies
import { config } from '../../../../src/config/index.js'

// Test helpers
const mockOidcConfig = {
  authorization_endpoint: 'https://oidc.example.com/authorize',
  token_endpoint: 'https://oidc.example.com/token',
  end_session_endpoint: 'https://oidc.example.com/logout',
  jwks_uri: 'https://oidc.example.com/jwks'
}

// Mocks
vi.mock('../../../../src/auth/get-oidc-config.js', async () => {
  return {
    getOidcConfig: async () => (mockOidcConfig)
  }
})

vi.mock('../../../../src/services/DAL/token/get-token-service.js', async () => {
  return {
    getTokenService: vi.fn(async () => 'mock-bearer-token')
  }
})

// Test constants
const mockForwardedUserToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250YWN0SWQiOjMwMjAwMDAwMDAsInJlbGF0aW9uc2hpcHMiOlsiMzAwOTAwMDozMDA5MDAwMDE6Q2xlYW4gY29udHJvbCAtIGV4YW1wbGUgMToxOkV4dGVybmFsOjAiXSwicm9sZXMiOlsiMzAwOTAwMDpBZ2VudDozIl19.mock-signature'
const sbi = '300900001'
const crn = '3020000000'
const sessionId = 'test.user11@defra.gov.uk'
const invalidDalEndpoint = 'http://nonexistent-domain-12345.invalid/graphql'

describe('DAL (data access layer) connector integration', () => {
  let server
  let dalConnector

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
    dalConnector = getDalConnector()
  })

  afterAll(async () => {
    if (server) {
      await server.stop()
    }
  })

  describe('when DAL responds successfully', () => {
    test('should return data without errors and status 200', async () => {
      const result = await dalConnector.query(
        exampleQuery,
        {
          sbi,
          crn
        },
        { forwardedUserToken: mockForwardedUserToken }
      )

      expect(result.data).toBeDefined()
      expect(result.errors).toBeNull()
      expect(result.statusCode).toBe(200)
    })
  })

  describe('when DAL endpoint is unavailable', () => {
    test('should return 500 error', async () => {
      const originalEndpoint = config.get('dalConfig.endpoint')

      try {
        config.set('dalConfig.endpoint', invalidDalEndpoint)

        const result = await dalConnector.query(
          exampleQuery,
          { sbi },
          { sessionId }
        )

        expect(result.data).toBeNull()
        expect(result.errors).toBeDefined()
        expect(result.statusCode).toBe(500)
      } finally {
        config.set('dalConfig.endpoint', originalEndpoint)
      }
    })
  })

  describe('when GraphQL query syntax is invalid', () => {
    test('should return 400 error', async () => {
      const invalidQuery = `
      query Business($sbi: ID!) {
        business(sbi: $sbi) {
          sbi
          invalidSyntax {{{
      }
    `

      const result = await dalConnector.query(
        invalidQuery,
        { sbi },
        { sessionId }
      )

      expect(result.data).toBeNull()
      expect(result.errors).toBeDefined()
      expect(result.errors[0].message).toBe('Syntax Error: Expected Name, found "{".')
      expect(result.statusCode).toBe(400)
    })
  })

  describe('when required query variables are missing', () => {
    test('should return 400 error', async () => {
      const result = await dalConnector.query(
        exampleQuery,
        {},
        { sessionId }
      )

      expect(result.data).toBeNull()
      expect(result.errors).toBeDefined()
      expect(result.errors[0].message).toBe('Variable "$sbi" of required type "ID!" was not provided.')
      expect(result.statusCode).toBe(400)
    })
  })
})
