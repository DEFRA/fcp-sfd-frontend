import Wreck from '@hapi/wreck'
import { config } from '../config/index.js'
import { createLogger } from '../utils/logger.js'
// import { ProxyAgent } from 'undici'

async function getOidcConfig () {
  const logger = createLogger()
  // const proxyAgent = new ProxyAgent()

  /* Wreck.agents = {
    https: proxyAgent,
    http: proxyAgent,
    httpsAllowUnauthorized: proxyAgent
  } */
  logger.info('In Oicd')
  const { payload } = await Wreck.get(config.get('defraId.wellKnownUrl'), {
    json: true
  })
  logger.info('out Oicd')
  return payload
}

export { getOidcConfig }
