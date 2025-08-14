import { config } from '../config/index.js'

import { createServer } from '../server.js'
import { createLogger } from './logger.js'

export const startServer = async () => {
  let server
  const logger = createLogger()

  try {
    logger.info('Initiate start server')
    server = await createServer()
    await server.start()
    logger.info('started server')

    server.logger.info('Server started successfully')
    server.logger.info(
      `Access your frontend on http://localhost:${config.get('server.port')}`
    )
  } catch (error) {
    logger.info('Server failed to start :(')
    logger.error(error)
  }

  return server
}
