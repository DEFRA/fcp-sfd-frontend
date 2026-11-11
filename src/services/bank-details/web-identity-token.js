import { GetWebIdentityTokenCommand } from '@aws-sdk/client-sts'
import { config } from '../../config/index.js'

const SIGNING_ALGORITHM = 'RS256'
const REFRESH_MARGIN_MS = 60000

let cachedToken = null
let pendingRequest = null

const generateWebIdentityToken = async (stsClient) => {
  const audience = config.get('bankDetails.webIdentityToken.audience')
  const duration = config.get('bankDetails.webIdentityToken.durationSeconds')

  const input = {
    SigningAlgorithm: SIGNING_ALGORITHM,
    Audience: [audience],
    DurationSeconds: duration
  }

  const command = new GetWebIdentityTokenCommand(input)

  const { WebIdentityToken, Expiration } = await stsClient.send(command)

  return { token: WebIdentityToken, expiresAt: Expiration }
}

/**
 * Returns a cached AWS WebIdentity token for fcp-sfd-bank-details, requesting a new one
 * from STS when the cached token is within a minute of expiry.
 *
 * @param {import('@aws-sdk/client-sts').STSClient} stsClient - The `STSClient` object
 * @returns {Promise<string|null>} the token, or null when ENVIRONMENT is local
 * @throws when the STS call fails
 */
const getWebIdentityToken = async (stsClient) => {
  // local: fcp-sfd-bank-details bypasses auth and there's no STS
  const environment = config.get('server.cdpEnvironment')

  if (environment === 'local') {
    return null
  }

  // cache: check the cached token is still valid beyond refresh margin.
  // `Expiration` is optional on the STS response, so guard it rather than cache
  // an entry whose expiry can never be read
  if (cachedToken?.expiresAt && cachedToken.expiresAt.getTime() - Date.now() > REFRESH_MARGIN_MS) {
    return cachedToken.token
  }

  // in-flight dedupe: concurrent callers share one STS request
  // and on failures the pending request is cleared so it isn't reused
  if (!pendingRequest) {
    pendingRequest = generateWebIdentityToken(stsClient)
      .then((result) => {
        cachedToken = result
        return result.token
      })
      .finally(() => {
        pendingRequest = null
      })
  }

  return pendingRequest
}

export {
  getWebIdentityToken
}
