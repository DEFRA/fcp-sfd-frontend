import process from 'node:process'
import { createLogger } from './utils/logger.js'
import { startServer } from './utils/start-server.js'
import { queryBuilder } from './dal/helper.js'
import { dalConnector } from './dal/connector.js'

await startServer()

const query = queryBuilder(
  'customer',
  'crn: "9477368292"',
  `business(sbi: "107591843") {
        name
      }`
)

const dal = await dalConnector(query)

const response = dal.data.customer.business.name
console.log('**********', response)

process.on('unhandledRejection', (error) => {
  const logger = createLogger()
  logger.info('Unhandled rejection')
  logger.error(error)
  process.exitCode = 1
})
