import { StatusCodes } from 'http-status-codes'

export function catchAll (request, h) {
  if (!request.response || !('isBoom' in request.response)) {
    return h.continue
  }

  const statusCode = request.response.output.statusCode

  switch (statusCode) {
    case StatusCodes.SERVICE_UNAVAILABLE:
      request.logger.error(request.response?.stack)
      return h
        .view('errors/service-unavailable')
        .code(statusCode)

    case StatusCodes.NOT_FOUND:
      request.logger.error(request.response?.stack)
      return h
        .view('errors/page-not-found')
        .code(statusCode)

    case StatusCodes.INTERNAL_SERVER_ERROR:
      request.logger.error(request.response?.stack)
      return h
        .view('errors/service-problem')
        .code(statusCode)

    default:
      request.logger.error(request.response?.stack)
      return h
        .view('errors/page-not-found')
        .code(statusCode)
  }
}
