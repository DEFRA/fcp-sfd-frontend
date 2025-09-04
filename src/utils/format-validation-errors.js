/**
 * Transforms raw validation errors from Joi into a format suitable for form display
 *
 * @param {Array<Object>} errors - Array of validation error objects from Joi
 *
 * @returns {Object} Formatted errors object where keys are field names and values are { text: "error message" }
 */

export const formatValidationErrors = (errors) => {
  const formattedErrors = {}

  errors.forEach(error => {
    const { type, context, message: text, path } = error

    // Multi-field validation: show error on all related fields (e.g., businessTelephone + businessMobile)
    if (type === 'object.missing' && Array.isArray(context?.peers)) {
      // Apply the same error message to all related fields
      context.peers.forEach(peer => {
        formattedErrors[peer] = { text }
      })
    // Single-field validation: show error on the specific field that failed
    } else if (!formattedErrors[path[0]]) {
      // Only add error if this field doesn't already have one (prevents overwriting)
      formattedErrors[path[0]] = { text }
    } else {
      // Field already has an error, don't overwrite it
    }
  })

  return formattedErrors
}
