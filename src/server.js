import path from 'path'
import hapi from '@hapi/hapi'
import Joi from 'joi'

import { config } from './config/index.js'
import { plugins } from './plugins/index.js'
import { catchAll } from './utils/errors.js'
import { getCacheEngine } from './utils/caching/cache-engine.js'

export const createServer = async () => {
  const server = hapi.server({
    port: config.get('server.port'),
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      },
      files: {
        relativeTo: path.resolve(config.get('server.root'), '.public')
      },
      security: {
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: false
        },
        xss: 'enabled',
        noSniff: true,
        xframe: true
      }
    },
    router: {
      stripTrailingSlash: true
    },
    cache: [
      {
        name: config.get('server.session.cache.name'),
        engine: getCacheEngine(
          (config.get('server.session.cache.engine'))
        )
      }
    ],
    state: {
      strictHeader: false
    }
  })
  server.validator(Joi)
  await server.register(plugins)

  // Partition the redis cache to allow tokens to be stored
  const tokenCache = server.cache({ cache: config.get('server.session.cache.name'), segment: 'tokenCache', expiresIn: config.get('redis.ttl') })
  server.app.tokenCache = tokenCache

  server.ext('onPreResponse', catchAll)

  return server
}
