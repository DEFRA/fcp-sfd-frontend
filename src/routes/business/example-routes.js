import { constants as httpConstants } from 'http2'
import { dalConnector } from '../../dal/connector.js'
// import { getSbiInfo } from '../../dal/queries/get-sbi-info.js'

const email = 'test.user11@defra.gov.uk'
const variables = { sbi: 107591843 }
const multiErrorQuery = `
query Business($sbi: ID!) {
  business(sbi: $sbi) {
    sbi
    info {
      name
      email {
        address
      }
      legalStatus {
        type
      }}}}}}}
    }
  }
}
`


const exampleDalConnectionRoute = {
  method: 'GET',
  path: '/example',
  handler: async (_request, h) => {
    const response = await dalConnector(multiErrorQuery, {}, email)

    if (response.errors) {
      return h.response({
        data: response.data,
        errors: response.errors.map(err => ({
          message: err.message,
          code: err.extensions?.code
        }))
      }).code(response.statusCode)
    }

    return h.response({
      message: 'success',
      data: response.data
    }).code(httpConstants.HTTP_STATUS_OK)
  }
}

export { exampleDalConnectionRoute }
