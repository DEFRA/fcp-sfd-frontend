import { StatusCodes } from 'http-status-codes'

function statusCodeMessage (statusCode) {
  switch (statusCode) {
    case StatusCodes.NOT_FOUND:
      return 'Page not found'
    case StatusCodes.FORBIDDEN:
      return 'Forbidden'
    case StatusCodes.UNAUTHORIZED:
      return 'Unauthorized'
    case StatusCodes.BAD_REQUEST:
      return 'Bad Request'
    default:
      return 'Something went wrong'
  }
}

export function catchAll (request, h) {
  if (!request.response || !('isBoom' in request.response)) {
    return h.continue
  }

  const statusCode = request.response.output.statusCode
  const errorMessage = statusCodeMessage(statusCode)

  switch (statusCode) {
    case StatusCodes.SERVICE_UNAVAILABLE:
      request.logger.error(request.response?.stack)
      return h
        .view('errors/service-unavailable', {})
        .code(statusCode)

    case StatusCodes.INTERNAL_SERVER_ERROR:
      request.logger.error(request.response?.stack)
      return h
        .view('errors/service-problem')
        .code(statusCode)

    default:
      return h
        .view('error', {
          pageTitle: errorMessage,
          heading: statusCode,
          message: errorMessage
        })
        .code(statusCode)
  }
}
