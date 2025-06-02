import process from 'node:process'
import { createLogger } from './utils/logger.js'
import { startServer } from './utils/start-server.js'
import { dalConnectionHandler } from './dal/connection-handler.js'

await startServer()

const query = `
  query Business {
  business(sbi: 107591843) {
    sbi
  }
}
`

const dal = await dalConnectionHandler(query)

const response = dal.data

console.log('------->', response)

process.on('unhandledRejection', (error) => {
  const logger = createLogger()
  logger.info('Unhandled rejection')
  logger.error(error)
  process.exitCode = 1
})
