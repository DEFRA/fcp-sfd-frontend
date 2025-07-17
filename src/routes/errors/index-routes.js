import { serviceUnavailable } from './service-unavailable-routes.js'
import { pageNotFound } from './page-not-found-routes.js'
import { serviceProblem } from './service-problem-routes.js'
import { featureFlagsConfig } from '../../config/feature-flags.js'

export const errors = featureFlagsConfig.allowErrorViews
  ? [serviceUnavailable, pageNotFound, serviceProblem]
  : []
