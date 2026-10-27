import { GetWebIdentityTokenCommand } from '@aws-sdk/client-sts'
import { config } from '../../config/index.js'

const TOKEN_DURATION_SECONDS = 300 // AWS STS caps this at 900 seconds (15 minutes)
const CACHE_SAFETY_MARGIN_MS = 30 * 1000 // stop reusing a token shortly before it actually expires

// Cache tokens by audience, since a single frontend could end up calling multiple backend services.
const tokenCache = new Map()

const generateToken = async (sts, audience) => {
  const command = new GetWebIdentityTokenCommand({
    SigningAlgorithm: 'RS256',
    Audience: [audience],
    DurationSeconds: TOKEN_DURATION_SECONDS
  })

  const { WebIdentityToken } = await sts.send(command)

  return WebIdentityToken
}

export const getBankDetailsServiceToken = async (sts) => {
  const audience = config.get('bankDetailsConfig.audience')
  const cached = tokenCache.get(audience)

  if (cached && cached.expiresAt > Date.now()) {
    return cached.token
  }

  const token = await generateToken(sts, audience)

  tokenCache.set(audience, {
    token,
    expiresAt: Date.now() + TOKEN_DURATION_SECONDS * 1000 - CACHE_SAFETY_MARGIN_MS
  })

  return token
}
