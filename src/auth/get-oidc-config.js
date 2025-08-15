import Wreck from '@hapi/wreck'
import { config } from '../config/index.js'
import { createLogger } from '../utils/logger.js'

async function getOidcConfig () {
  const logger = createLogger()
  logger.info('In Oicd')
  const { payload } = await Wreck.get(config.get('defraId.wellKnownUrl'), {
    json: true
  })
  logger.info('out Oicd')
  return payload
  /* try {
    const { payload } = await Wreck.get(config.get('defraId.wellKnownUrl'), {
      json: true
    })
    logger.info('got pay load here')
    logger.info(payload)
    return payload
  } catch (err) {
    throw new Error('Unable to connect to DefraId ' + config.get('defraId.wellKnownUrl') + ' ' + err.message)
  } */
}

export { getOidcConfig }
