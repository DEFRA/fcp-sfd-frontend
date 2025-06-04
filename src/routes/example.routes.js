import { constants as httpConstants } from 'http2'
import { createLogger } from '../utils/logger.js'
import { dalConnector } from '../../src/dal/connector.js'
import { getSbi } from '../dal/queries/get-sbi.js'

const email = 'test.user11@defra.gov.uk'

const exampleDalConnectionRoute = {
  method: 'GET',
  path: '/example',
  handler: async (request, h) => {
    const logger = createLogger()
    
    try {
      const dal = await dalConnector(getSbi, email)
      const response = dal.data

      logger.info('---> This is from the DAL', JSON.stringify(response))
      return h.response({message: 'success'}).code(httpConstants.HTTP_STATUS_OK)
    } catch (error) {
      logger.error(error, 'Error fetching data from DAL')
      return h.response({ error: 'Failed to fetch data' }).code(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    }
  }
}

export { exampleDalConnectionRoute }
