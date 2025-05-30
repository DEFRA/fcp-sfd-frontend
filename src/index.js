import process from 'node:process'
import { createLogger } from './utils/logger.js'
import { startServer } from './utils/start-server.js'
import { dalConnector } from './dal/connector.js'
import { query } from './dal/query.js'

await startServer()
const data = await dalConnector(query)
console.log(data)

process.on('unhandledRejection', (error) => {
  const logger = createLogger()
  logger.info('Unhandled rejection')
  logger.error(error)
  process.exitCode = 1
})
