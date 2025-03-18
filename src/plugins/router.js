import inert from '@hapi/inert'

import { routes } from '../routes/index.js'

export const router = {
  plugin: {
    name: 'router',
    async register (server) {
      await server.register([inert])
      server.route(routes)
    }
  }
}
