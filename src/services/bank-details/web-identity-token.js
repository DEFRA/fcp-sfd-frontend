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

const getWebIdentityToken = async (stsClient) => {
  // local: fcp-sfd-bank-details bypasses auth and there's no STS
  const environment = config.get('server.cdpEnvironment')

  if (environment === 'local') {
    return null
  }

  // cache: check the cached token is still valid beyond refresh margin
  if (cachedToken && cachedToken.expiresAt.getTime() - Date.now() > REFRESH_MARGIN_MS) {
    return cachedToken.token
  }

  // in-flight dedupe: concurrent callers share one STS request
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
