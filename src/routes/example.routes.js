import { constants as httpConstants } from 'http2'
import { dalConnector } from '../../src/dal/connector.js'
import { createLogger } from '../utils/logger.js'

const query = `
query Business {
  business(sbi: 107591843) {
    sbi
  }
}
`

const email = 'test.user11@defra.gov.uk'

const exampleDalConnectionRoute = {
  method: 'GET',
  path: '/example',
  handler: async (request, h) => {
    try {
      const logger = createLogger()
      const dal = await dalConnector(query, email)
      const response = dal.data

      logger.info('---> This is from the DAL', JSON.stringify(response, null, 2))
      return h.response(response).code(httpConstants.HTTP_STATUS_OK)
    } catch (error) {
      logger.error(error, 'Error fetching data from DAL')
      return h.response({ error: 'Failed to fetch data' }).code(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    }
  }
}

export { exampleDalConnectionRoute }