import inert from '@hapi/inert'

import { health } from '../routes/health.js'
import { staticAssetRoutes } from '../routes/static-assets.js'
import { home } from '../routes/home.js'

export const router = {
  plugin: {
    name: 'router',
    async register (server) {
      await server.register([inert])

      const appSpecificRoutes = [home]

      server.route([health, ...staticAssetRoutes].concat(appSpecificRoutes))
    }
  }
}
