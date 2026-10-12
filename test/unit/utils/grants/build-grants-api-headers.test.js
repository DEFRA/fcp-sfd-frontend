// Test framework dependencies
import crypto from 'node:crypto'
import Jwt from '@hapi/jwt'
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import {
  buildAuthorizationHeader,
  buildUserContextHeader
} from '../../../../src/utils/grants/build-grants-api-headers.js'

// Mock dependencies
import { config } from '../../../../src/config/index.js'

// Mock imports
vi.mock('../../../../src/config/index.js', () => ({
  config: {
    get: vi.fn()
  }
}))

const AUTH_TOKEN = 'auth-token'
const ENCRYPTION_KEY = 'encryption-key'
const USER_CONTEXT_SECRET = 'allowlist-jwt-secret'

/**
 * Reverses buildAuthorizationHeader so the tests assert against what the Grants
 * API would actually decrypt, rather than against our own implementation.
 */
const decryptAuthorizationHeader = (header, encryptionKey) => {
  const composite = Buffer.from(header.replace('Bearer ', ''), 'base64').toString('utf8')
  const [iv, authTag, encrypted] = composite.split(':')

  const key = crypto.scryptSync(encryptionKey, 'salt', 32)
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64'))
  decipher.setAuthTag(Buffer.from(authTag, 'base64'))

  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, 'base64')),
    decipher.final()
  ]).toString('utf8')
}

describe('buildGrantsApiHeaders', () => {
  const sbi = 123456789
  const crn = 987654321

  beforeEach(() => {
    vi.clearAllMocks()

    config.get.mockImplementation((key) => {
      return {
        'grantsApiConfig.authToken': AUTH_TOKEN,
        'grantsApiConfig.encryptionKey': ENCRYPTION_KEY,
        'grantsApiConfig.userContextSecret': USER_CONTEXT_SECRET
      }[key]
    })
  })

  describe('buildAuthorizationHeader', () => {
    test('it returns a bearer token that decrypts back to the configured auth token', () => {
      const result = buildAuthorizationHeader()

      expect(result).toMatch(/^Bearer /)
      expect(decryptAuthorizationHeader(result, ENCRYPTION_KEY)).toBe(AUTH_TOKEN)
    })

    test('it uses a fresh initialisation vector for every call', () => {
      expect(buildAuthorizationHeader()).not.toBe(buildAuthorizationHeader())
    })
  })

  describe('buildUserContextHeader', () => {
    test('it returns a JWT containing the CRN and SBI as strings', () => {
      const result = buildUserContextHeader(sbi, crn)

      const { decoded } = Jwt.token.decode(result)

      expect(decoded.payload.crn).toBe('987654321')
      expect(decoded.payload.sbi).toBe('123456789')
    })

    test('it signs the JWT with the configured secret', () => {
      const result = buildUserContextHeader(sbi, crn)

      const decoded = Jwt.token.decode(result)

      expect(() =>
        Jwt.token.verifySignature(decoded, { key: USER_CONTEXT_SECRET, algorithm: 'HS256' })
      ).not.toThrow()
    })

    test('it sets an expiry so the token cannot be replayed indefinitely', () => {
      const result = buildUserContextHeader(sbi, crn)

      const { decoded } = Jwt.token.decode(result)

      expect(decoded.payload.exp).toBeGreaterThan(decoded.payload.iat)
    })
  })
})
