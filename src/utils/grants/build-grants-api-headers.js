/**
 * Builds the two authentication headers required by every call to the Grants API
 * (`grants-ui-backend`).
 *
 * The Grants API authenticates each request twice:
 * - `Authorization` proves *which service* is calling (a shared token, encrypted)
 * - `x-user-context` proves *which user* the call is on behalf of (a signed JWT)
 *
 * Both schemes are dictated by the Grants API, so the implementations here
 * deliberately mirror `grants-ui-backend/src/modules/config/ingest/broker-auth.js`
 * and its `scripts/generateUserContextHeader.js`. Any change to either scheme
 * upstream must be reflected here.
 *
 * @module buildGrantsApiHeaders
 */

import crypto from 'node:crypto'
import Jwt from '@hapi/jwt'

import { config } from '../../config/index.js'

// The Grants API derives its AES key with scrypt using a fixed salt of the
// literal string 'salt'. Not our choice, but it must match exactly or the
// API cannot decrypt the token.
const SCRYPT_SALT = 'salt'
const AES_KEY_LENGTH_BYTES = 32
const AES_IV_LENGTH_BYTES = 12
const AES_ALGORITHM = 'aes-256-gcm'

// Kept deliberately short. The token is minted per request and used immediately,
// so it never needs to outlive the call it was created for.
const USER_CONTEXT_TTL_SECONDS = 300

/**
 * Builds the service-to-service `Authorization` header value.
 *
 * The Grants API expects `Bearer base64(iv:authTag:encryptedToken)`, where each
 * of the three colon-separated parts is itself base64 encoded, and the encrypted
 * payload is the shared plain-text auth token.
 *
 * A fresh random IV is generated per call, so the header value differs every
 * time even though the underlying token does not.
 *
 * @returns {string} The `Authorization` header value, including the `Bearer ` prefix
 */
const buildAuthorizationHeader = () => {
  const authToken = config.get('grantsApiConfig.authToken')
  const encryptionKey = config.get('grantsApiConfig.encryptionKey')

  const key = crypto.scryptSync(encryptionKey, SCRYPT_SALT, AES_KEY_LENGTH_BYTES)
  const iv = crypto.randomBytes(AES_IV_LENGTH_BYTES)
  const cipher = crypto.createCipheriv(AES_ALGORITHM, key, iv)

  const encrypted = Buffer.concat([cipher.update(authToken, 'utf8'), cipher.final()])

  // The auth tag is only available once the cipher has been finalised above
  const authTag = cipher.getAuthTag()

  const composite = `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted.toString('base64')}`

  return `Bearer ${Buffer.from(composite, 'utf8').toString('base64')}`
}

/**
 * Builds the `x-user-context` header value identifying the signed in user.
 *
 * This is an HS256 JWT containing the user's CRN and SBI, signed with a secret
 * shared with the Grants team. The Grants API rejects the request with a 401 if
 * either claim is missing, and it compares the claims as strings, so both are
 * coerced here.
 *
 * @param {string|number} sbi - Single Business Identifier of the selected business
 * @param {string|number} crn - Customer Reference Number of the signed in user
 * @returns {string} A signed JWT suitable for the `x-user-context` header
 */
const buildUserContextHeader = (sbi, crn) => {
  const userContextSecret = config.get('grantsApiConfig.userContextSecret')

  return Jwt.token.generate(
    {
      crn: String(crn),
      sbi: String(sbi)
    },
    {
      key: userContextSecret,
      algorithm: 'HS256'
    },
    {
      ttlSec: USER_CONTEXT_TTL_SECONDS
    }
  )
}

export {
  buildAuthorizationHeader,
  buildUserContextHeader
}
