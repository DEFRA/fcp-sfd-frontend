/**
 * Session journey configurations for route guards and pre-handlers.
 * Each journey defines the session key and redirect path for a change/fix workflow.
 * The field being checked is passed separately to checkSessionDataGuard.
 */

// Business details change journey (used for all business check routes)
export const BUSINESS_JOURNEY = {
  sessionKey: 'businessDetailsUpdate',
  redirectPath: '/business-details'
}

// Personal details change journey (used for all personal check routes)
export const PERSONAL_JOURNEY = {
  sessionKey: 'personalDetailsUpdate',
  redirectPath: '/personal-details'
}

// Business fix (interrupter) journey
export const BUSINESS_DETAILS_VALIDATION_JOURNEY = {
  journeyKey: 'businessDetailsValidation',
  redirectPath: '/business-details'
}

// Personal fix (interrupter) journey
export const PERSONAL_DETAILS_VALIDATION_JOURNEY = {
  journeyKey: 'personalDetailsValidation',
  redirectPath: '/personal-details'
}
