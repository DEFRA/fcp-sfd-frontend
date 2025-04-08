import path from 'path'
import hapi from '@hapi/hapi'
import Joi from 'joi'

import { config } from './config/config.js'
import { plugins } from './plugins/index.js'
import { catchAll } from './utils/errors.js'
import { getCacheEngine } from './utils/caching/cache-engine.js'

export async function createServer () {
  const server = hapi.server({
    port: config.get('port'),
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      },
      files: {
        relativeTo: path.resolve(config.get('root'), '.public')
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
        name: config.get('session.cache.name'),
        engine: getCacheEngine(
          (config.get('session.cache.engine'))
        )
      }
    ],
    state: {
      strictHeader: false
    }
  })
  server.validator(Joi)
  await server.register(plugins)

  server.ext('onPreResponse', catchAll)

  return server
}
