import inert from '@hapi/inert'

import { routes } from '../routes/index-routes.js'

export const router = {
  plugin: {
    name: 'router',
    async register (server) {
      await server.register([inert])
      server.route(routes)
    }
  }
}
