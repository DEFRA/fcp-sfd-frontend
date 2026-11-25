/**
 * Hapi pre-handlers for session data and journey validation guards.
 * Redirects to the specified path if required session data is missing or invalid.
 */

import { services } from '@defra/fcp-sfd-frontend-engine'
import { checkBusinessPermissionGroupService } from '../services/business/check-business-permission-group-service.js'
import { PERMISSION_GROUP } from '../constants/scope/business-details.js'
import { isBusinessFieldAccessible, isPersonalFieldAccessible } from '../utils/feature-toggle/check-field-accessibility.js'

/**
 * Creates a pre-handler that blocks a business journey route when its field is switched off by a feature toggle.
 * Redirects to the business details page, which shows the disabled-field notification.
 *
 * Note: Hapi validates payloads before `options.pre`, so an invalid POST to a disabled field
 * returns the form with a 400 from `failAction` rather than redirecting. This is a known and accepted
 * trade-off: the handler never runs so nothing is saved, and genuine users navigate via GET, which is
 * redirected correctly. The toggle only steers users away from error pages when an upstream issue is known.
 *
 * @param {string} field - The business field to check (name, address, phone, email, vat, registrationNumber)
 * @returns {Object} Hapi pre-handler object
 */
export const checkBusinessFieldAccessibleGuard = (field) => {
  return {
    method: (_request, h) => {
      if (!isBusinessFieldAccessible(field)) {
        return h.redirect('/business-details').takeover()
      }

      return true
    }
  }
}

/**
 * Creates a pre-handler that blocks a personal journey route when its field is switched off by a feature toggle.
 * Redirects to the personal details page, which shows the disabled-field notification.
 *
 * Note: Hapi validates payloads before `options.pre`, so an invalid POST to a disabled field
 * returns the form with a 400 from `failAction` rather than redirecting. See
 * `checkBusinessFieldAccessibleGuard` for why this is accepted.
 *
 * @param {string} field - The personal field to check (name, dob, address, phone, email)
 * @returns {Object} Hapi pre-handler object
 */
export const checkPersonalFieldAccessibleGuard = (field) => {
  return {
    method: (_request, h) => {
      if (!isPersonalFieldAccessible(field)) {
        return h.redirect('/personal-details').takeover()
      }

      return true
    }
  }
}

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
 * Creates a Hapi pre-handler that stops users without legal permission from fixing the
 * business name or VAT number.
 * Used to guard the business fix/interrupter journey routes.
 *
 * Checks `sectionsNeedingUpdate` (set by the business details page), `orderedSectionsToFix`
 * (set once the fix journey starts) and the `source` query parameter so the same guard works
 * on every route in the journey.
 *
 * @param {Object} journey - Journey configuration object with journeyKey and redirectPath properties
 * @returns {Object} Hapi pre-handler object
 *
 * @example
 * import { BUSINESS_DETAILS_VALIDATION_JOURNEY } from '../../constants/journeys.js'
 * import { checkBusinessFixLegalSectionsPreHandler } from '../pre-handlers.js'
 *
 * const postFixList = {
 *   method: 'POST',
 *   path: '/business-fix-list',
 *   options: {
 *     pre: [checkBusinessFixLegalSectionsPreHandler(BUSINESS_DETAILS_VALIDATION_JOURNEY)]
 *   },
 *   handler: async (request, h) => { ... }
 * }
 */
export const checkBusinessFixLegalSectionsPreHandler = (journey) => {
  return {
    method: (request, h) => {
      const { yar, auth, query } = request
      const source = query?.source

      const permissionGroup = checkBusinessPermissionGroupService(auth.credentials.scope)

      // The legal group covers both make legal changes and full permission
      if (permissionGroup === PERMISSION_GROUP.LEGAL) {
        return true
      }

      const sessionData = yar.get(journey.journeyKey) || {}

      // The journey has not been initialised yet, so check the raw sections needing update and the raw source
      if (sessionData.sectionsNeedingUpdate) {
        const { sectionsNeedingUpdate } = sessionData

        if (sectionsNeedingUpdate.includes('name') || sectionsNeedingUpdate.includes('vat') || source === 'name' || source === 'vat') {
          return h.redirect(journey.redirectPath).takeover()
        }
      }

      // orderedSectionsToFix already has the source at the start of the array, so it needs no separate check
      if (sessionData.orderedSectionsToFix) {
        const { orderedSectionsToFix } = sessionData

        if (orderedSectionsToFix.includes('name') || orderedSectionsToFix.includes('vat')) {
          return h.redirect(journey.redirectPath).takeover()
        }
      }

      return true
    }
  }
}
