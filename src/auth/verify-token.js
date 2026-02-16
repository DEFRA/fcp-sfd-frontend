import Wreck from '@hapi/wreck'
import Jwt from '@hapi/jwt'
import jwkToPem from 'jwk-to-pem'
import { getOidcConfig } from './get-oidc-config.js'
import { createLogger } from '../utils/logger.js'

const logger = createLogger()

async function verifyToken (token) {
  logger.info('Fetching OIDC config for token verification')
  let uri
  try {
    ({ jwks_uri: uri } = await getOidcConfig())
  } catch (error) {
    logger.error(error, 'Failed to fetch OIDC config')
    throw error
  }

  logger.info({ uri }, 'Fetching JWKS keys')
  let keys
  try {
    const { payload } = await Wreck.get(uri, {
      json: true
    })
    keys = payload.keys
  } catch (error) {
    logger.error(error, 'Failed to fetch JWKS keys')
    throw error
  }

  if (!keys || keys.length === 0) {
    logger.error('No JWKS keys returned')
    throw new Error('No JWKS keys returned')
  }

  // Convert the JSON Web Key (JWK) to a PEM-encoded public key so that it can be used to verify the token
  const pem = jwkToPem(keys[0])

  // Check that the token is signed with the appropriate key by decoding it and verifying the signature using the public key
  const decoded = Jwt.token.decode(token)
  try {
    Jwt.token.verify(decoded, { key: pem, algorithm: 'RS256' })
  } catch (error) {
    logger.error(error, 'Token signature verification failed')
    throw error
  }

  logger.info('Token verified successfully')
}

export { verifyToken }
