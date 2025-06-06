import { constants as httpConstants } from 'http2'
import { dalConnector } from '../../src/dal/connector.js'
import { getSbi } from '../dal/queries/get-sbi.js'

const email = 'test.user11@defra.gov.uk'
const variables = { sbi: 107591843 }

const exampleDalConnectionRoute = {
  method: 'GET',
  path: '/example',
  handler: async (_request, h) => {
    const dal = await dalConnector(getSbi, variables, email)
    const dalData = dal.data

    return h.response({
      message: 'success',
      data: dalData
    }).code(httpConstants.HTTP_STATUS_OK)
  }
}

export { exampleDalConnectionRoute }
