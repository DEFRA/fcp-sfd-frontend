/**
 * Hapi pre-handlers for session data and journey validation guards.
 * Redirects to the specified path if required session data is missing or invalid.
 */

import { services } from '@defra/fcp-sfd-frontend-engine'
import { fetchBusinessDetailsService } from '../services/business/fetch-business-details-service.js'

/**
 * Creates a pre-handler that validates required session data exists before allowing access to a route.
 * Used to guard change/check journeys where the user must have completed a prior step.
 *
 * @param {Object} journey - Journey configuration object with sessionKey and redirectPath properties
 * @param {string|string[]} fieldName - The session field name(s) to check (e.g., 'changePersonalDob' or ['changeBusinessPostcode', 'changeBusinessAddresses'])
 * @returns {Object} Hapi pre-handler object
 *
 * @example
 * import { PERSONAL_JOURNEY } from '../../constants/journeys.js'
 * import { checkSessionDataGuard } from '../pre-handlers.js'
 *
 * const getDobCheck = {
 *   method: 'GET',
 *   path: '/account-date-of-birth-check',
 *   options: {
 *     pre: [checkSessionDataGuard(PERSONAL_JOURNEY, 'changePersonalDob')]
 *   },
 *   handler: async (request, h) => { ... }
 * }
 */
export const checkSessionDataGuard = (journey, fieldName) => {
  return {
    method: async (request, h) => {
      const { yar } = request
      const fieldNames = Array.isArray(fieldName) ? fieldName : [fieldName]

      // Get the session data
      const sessionData = yar.get(journey.sessionKey) || {}

      // Check if all required fields exist (not undefined/null)
      // Allows falsy values like false, 0, '' which are valid session data
      const allFieldsPresent = fieldNames.every(field => sessionData[field] != null)

      if (!allFieldsPresent) {
        // Return redirect directly - bypasses the route handler
        return h.redirect(journey.redirectPath).takeover()
      }

      // Continue to the route handler
      return true
    }
  }
}

/**
 * Creates a Hapi pre-handler that checks the interrupted journey session.
 * Redirects to the given path if the session is invalid.
 * Used to guard fix/interrupter journey routes.
 *
 * @param {Object} journey - Journey configuration object with journeyKey and redirectPath properties
 * @returns {Object} Hapi pre-handler object
 *
 * @example
 * import { BUSINESS_DETAILS_VALIDATION_JOURNEY } from '../../constants/journeys.js'
 * import { checkInterrupterJourneyPreHandler } from '../pre-handlers.js'
 *
 * const getFixCheck = {
 *   method: 'GET',
 *   path: '/business-fix-check',
 *   options: {
 *     pre: [checkInterrupterJourneyPreHandler(BUSINESS_DETAILS_VALIDATION_JOURNEY)]
 *   },
 *   handler: async (request, h) => { ... }
 * }
 */
export const checkInterrupterJourneyPreHandler = (journey) => {
  return {
    method: (request, h) => {
      const { yar } = request

      const isValid = services.checkInterrupterJourneySession(yar, journey.journeyKey)

      if (!isValid) {
        return h.redirect(journey.redirectPath).takeover()
      }

      return true
    }
  }
}

/**
 * Creates a pre-handler that redirects to the home page unless the business's legal status code is in the allowed list.
 * Used to stop users reaching a registration number journey that doesn't apply to their legal status.
 *
 * @param {string[]} allowedLegalStatusCodes - Legal status codes permitted to access the route
 * @returns {Object} Hapi pre-handler object
 *
 * @example
 * pre: [checkLegalStatusGuard(constants.business.COMPANY_REGISTRATION_LEGAL_STATUS_CODES)]
 */
export const checkLegalStatusGuard = (allowedLegalStatusCodes) => {
  return {
    method: async (request, h) => {
      const { auth } = request

      const businessDetails = await fetchBusinessDetailsService(auth.credentials)
      const legalStatusCode = String(businessDetails.legalStatusCode ?? '')

      if (!allowedLegalStatusCodes.includes(legalStatusCode)) {
        return h.redirect('/home').takeover()
      }

      return h.continue
    }
  }
}
