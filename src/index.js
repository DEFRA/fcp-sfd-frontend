import process from 'node:process'
import { createLogger } from './utils/logger.js'
import { startServer } from './utils/start-server.js'
import { dalConnectionHandler } from './dal/connection-handler.js'

await startServer()

const query = `
query Business {
  business(sbi: 107591843) {
    info {
      address {
        pafOrganisationName
        buildingNumberRange
        buildingName
        flatName
        street
        city
        county
        postalCode
        country
        uprn
        dependentLocality
        doubleDependentLocality
        typeId
      }
      email {
        address
      }
      legalStatus {
        type
      }
      name
      phone {
        mobile
      }
      reference
      traderNumber
      vat
      vendorNumber
    }
  }
}
`

const dal = await dalConnectionHandler(query)

const response = dal.data.business.info

console.log('---> THIS IS FROM THE DAL', JSON.stringify(response, null, 2))

process.on('unhandledRejection', (error) => {
  const logger = createLogger()
  logger.info('Unhandled rejection')
  logger.error(error)
  process.exitCode = 1
})
