import { GetWebIdentityTokenCommand } from '@aws-sdk/client-sts'
import { config } from '../../config/index.js'

const generateWebIdentityToken = async (stsClient, duration) => {
  const audience = config.get('bankDetails.webIdentityToken.audience')
  const duration = config.get('bankDetails.webIdentityToken.durationSeconds')

  const input = {
    SigningAlgorithm: 'RS256',
    Audience: [tokenAudience],
    DurationSeconds: tokenDuration
  }

  const command = GetWebIdentityTokenCommand(input)

  const { WebIdentityToken, Expiration } = await stsClient.send(command)

  return WebIdentityToken
}

