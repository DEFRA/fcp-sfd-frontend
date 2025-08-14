import path from 'path'
import hapi from '@hapi/hapi'
import Joi from 'joi'

import { config } from './config/index.js'
import { plugins } from './plugins/index.js'
import { catchAll } from './utils/errors.js'
import { getCacheEngine } from './utils/caching/cache-engine.js'
import { setupProxy } from './utils/setup-proxy.js'
import { createLogger } from './utils/logger.js'

export const createServer = async () => {
  setupProxy()
  const logger = createLogger()

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
          preload: true
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

  server.app.cache = server.cache({
    cache: config.get('server.session.cache.name'),
    segment: config.get('server.session.cache.segment'),
    expiresIn: config.get('server.session.cache.ttl')
  })
  server.validator(Joi)
  logger.info('Started plugins registration')
  try {
    await server.register(plugins)
  } catch (err) {
    throw new Error('unable to register plugim ' * err.message)
  }

  logger.info('all plugins registered')

  server.ext('onPreResponse', catchAll)
  logger.info('Created server')
  return server
}
