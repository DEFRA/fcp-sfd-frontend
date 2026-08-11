/**
 * Creates a pre-handler that validates required session data exists before allowing access to a route.
 * If the required field is missing from session, redirects to the appropriate details page.
 *
 * @param {string|string[]} fieldName - The session field name(s) to check (e.g., 'changePersonalDob' or ['changeBusinessPostcode', 'changeBusinessAddresses'])
 * @param {string} redirectPath - The path to redirect to if data is missing (e.g., '/personal-details')
 * @param {string} sessionKey - The session object key to check (e.g., 'businessDetailsUpdate' or 'personalDetailsUpdate')
 * @returns {Object} Hapi pre-handler object
 *
 * @example
 * // Single field check
 * const checkDob = checkSessionDataGuard(
 *   'changePersonalDob',
 *   '/personal-details',
 *   'personalDetailsUpdate'
 * )
 *
 * // Multiple field check
 * const checkAddress = checkSessionDataGuard(
 *   ['changeBusinessPostcode', 'changeBusinessAddresses'],
 *   '/business-details',
 *   'businessDetailsUpdate'
 * )
 *
 * // Usage in route options:
 * options: {
 *   pre: [checkAddress],
 *   handler: async (request, h) => { ... }
 * }
 */
export const checkSessionDataGuard = (fieldName, redirectPath, sessionKey) => {
  return {
    method: async (request, h) => {
      const { yar } = request
      const fieldNames = Array.isArray(fieldName) ? fieldName : [fieldName]

      // Get the session data
      const sessionData = yar.get(sessionKey) || {}

      // Check if all required fields exist
      const allFieldsPresent = fieldNames.every(field => sessionData[field])

      if (!allFieldsPresent) {
        // Return redirect directly - bypasses the route handler
        return h.redirect(redirectPath).takeover()
      }

      // Continue to the route handler
      return h.continue
    }
  }
}
