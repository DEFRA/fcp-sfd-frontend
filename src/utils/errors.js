import { constants as httpConstants } from 'http2'

function statusCodeMessage (statusCode) {
  switch (statusCode) {
    case httpConstants.HTTP_STATUS_NOT_FOUND:
      return 'Page not found'
    case httpConstants.HTTP_STATUS_FORBIDDEN:
      return 'Forbidden'
    case httpConstants.HTTP_STATUS_UNAUTHORIZED:
      return 'Unauthorized'
    case httpConstants.HTTP_STATUS_BAD_REQUEST:
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

  if (statusCode >= httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR) {
    request.logger.error(request.response?.stack)
  }

  return h
    .view('error', {
      pageTitle: errorMessage,
      heading: statusCode,
      message: errorMessage
    })
    .code(statusCode)
}
