import { constants } from '@defra/fcp-sfd-frontend-engine'

export const errors = {
  plugin: {
    name: 'errors',
    register: (server, _options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          const statusCode = response.output.statusCode

          let template = 'errors/service-problem'

          if (statusCode === constants.statusCodes.FORBIDDEN) {
            template = 'unauthorised'
          }

          if (statusCode === constants.statusCodes.NOT_FOUND) {
            template = 'errors/page-not-found'
          }

          if (statusCode >= constants.statusCodes.INTERNAL_SERVER_ERROR) {
            request.log('error', {
              statusCode,
              message: response.message,
              stack: response.data?.stack
            })
          }

          const viewResponse = h.view(template, { backLink: request.headers.referer }).code(statusCode)

          const originalHeaders = response.headers || response.output?.headers || {}
          for (const [key, value] of Object.entries(originalHeaders)) {
            if (key.toLowerCase() === 'content-type') {
              continue
            }
            viewResponse.header(key, value)
          }

          return viewResponse
        }
        return h.continue
      })
    }
  }
}
