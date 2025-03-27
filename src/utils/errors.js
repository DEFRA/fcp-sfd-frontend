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
        .view('errors/service-unavailable', {})
        .code(statusCode)

  if (statusCode === StatusCodes.NOT_FOUND) {
    return h
      .view('errors/page-not-found', {
      })
    }
  if (statusCode === StatusCodes.SERVICE_UNAVAILABLE) {
    return h
      .view('errors/service-unavailable', {})
      .code(statusCode)
  }
    case StatusCodes.INTERNAL_SERVER_ERROR:
      request.logger.error(request.response?.stack)
      return h
        .view('errors/service-problem')
        .code(statusCode)

    default:
      return h
        .view('errors/service-problem')
        .code(statusCode)
  }
}
