import { serviceUnavailable } from './service-unavailable.js'
import { pageNotFound } from './page-not-found.js'
import { serviceProblem } from './service-problem.js'
import { config } from '../../config/index.js'

export const errors = config.get('server.allowErrorViews')
  ? [serviceUnavailable, pageNotFound, serviceProblem]
  : []
