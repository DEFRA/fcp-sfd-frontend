import { constants } from 'node:http2'
const { HTTP_STATUS_FORBIDDEN, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_INTERNAL_SERVER_ERROR } = constants

export const errors = {
  plugin: {
    name: 'errors',
    register: (server, _options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          const statusCode = response.output.statusCode

          let template = 'errors/service-problem'

          if (statusCode === HTTP_STATUS_FORBIDDEN) {
            template = 'unauthorised'
          }

          if (statusCode === HTTP_STATUS_NOT_FOUND) {
            template = 'errors/page-not-found'
          }

          if (statusCode >= HTTP_STATUS_INTERNAL_SERVER_ERROR) {
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

/* export const errors = {
  plugin: {
    name: 'errors',
    register: (server, _options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (!response.isBoom) {
          return h.continue
        }

        const statusCode = response.output.statusCode

        // Catch any user in incorrect scope errors
        if (statusCode === HTTP_STATUS_FORBIDDEN) {
          return h.view('unauthorised', { backLink: request.headers.referer }).code(statusCode)
        }

        if (statusCode === HTTP_STATUS_NOT_FOUND) {
          return h.view('errors/page-not-found', { backLink: request.headers.referer })
        }

        request.log('error', {
          statusCode,
          message: response.message,
          stack: response.data?.stack
        })

        return h.view('errors/service-problem', { backLink: request.headers.referer }).code(statusCode)
      })
    }
  }
} */
