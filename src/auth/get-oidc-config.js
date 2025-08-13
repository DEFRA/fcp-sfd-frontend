import Wreck from '@hapi/wreck'
import { config } from '../config/index.js'

async function getOidcConfig () {
  try {
    const { payload } = await Wreck.get(config.get('defraId.wellKnownUrl'), {
      json: true
    })

    return payload
  } catch (err) {
    throw new Error('Unable to connect to DefraId ' + config.get('defraId.wellKnownUrl'))
  }
}

export { getOidcConfig }
