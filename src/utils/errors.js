import {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  SERVICE_UNAVAILABLE
} from '../constants/status-codes.js'

export const catchAll = (request, h) => {
  if (!request.response || !('isBoom' in request.response)) {
    return h.continue
  }

  const statusCode = request.response.output.statusCode

  const errorViewMap = {
    [SERVICE_UNAVAILABLE]: 'errors/service-unavailable',
    [NOT_FOUND]: 'errors/page-not-found',
    [INTERNAL_SERVER_ERROR]: 'errors/service-problem'
  }

  const viewPath = errorViewMap[statusCode] || 'errors/page-not-found'

  request.logger.error(request.response?.stack)
  return h
    .view(viewPath)
    .code(statusCode)
}
