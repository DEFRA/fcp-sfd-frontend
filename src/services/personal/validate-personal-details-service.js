/**
 * Validates personal details against the personal details schema
 *
 * If validation passes it:
 * - Marks the personal details as validated
 * - Persists a successful validation flag in the session
 * - Returns `true`
 *
 * If validation fails it:
 * - Marks the personal details as not validated
 * - Maps validation errors to form field names
 * - Saves validation errors and status in the session
 * - Returns `false`
 *
 * This service only handles validation and session state.
 * It expects the personal details data to already be mapped correctly.
 *
 * @module validatePersonalDetailsService
 */

import { personalDetailsSchema } from '../../schemas/personal/personal-details-schema.js'

const validatePersonalDetailsService = (personalDetails, yar, sessionId) => {
  console.log('🚀 ~ personalDetails:', personalDetails)
  personalDetails.info.fullName.first = null
  personalDetails.info.dateOfBirth = null
  personalDetails.contact.telephone = null
  personalDetails.contact.mobile = null
  personalDetails.address.lookup.uprn = null
  personalDetails.contact.email = 'test'

  const { error } = personalDetailsSchema.validate(personalDetails, { abortEarly: false })

  if (!error) {
    personalDetails.validated = true
    setValidationState(yar, sessionId, true)

    return true
  }

  const validationErrors = mapErrorPaths(error.details)

  personalDetails.validated = false
  personalDetails.validationErrors = validationErrors

  setValidationState(yar, sessionId, false, validationErrors)

  return false
}

const setValidationState = (yar, sessionId, isValid, validationErrors = []) => {
  yar.set(sessionId, {
    personalDetailsValid: isValid,
    validationErrors: isValid ? undefined : validationErrors
  })
}

/**
 * Turns validation errors into a list of form fields with problems.
 *
 * If multiple errors relate to the same field, the field is only
 * returned once.
 */
const mapErrorPaths = (errorDetails) => {
  const errorPathMap = {
    'info.fullName.first': 'name',
    'info.fullName.last': 'name',
    'info.dateOfBirth': 'dob',
    'contact.email': 'email',
    'contact.telephone': 'phone',
    'contact.mobile': 'phone',
    address: 'address'
  }

  // Create a set to store unique error paths
  const errorPaths = new Set()

  for (const { path, type } of errorDetails) {
    console.log('🚀 ~ path:', path)
    // Join the path segments into a single string e.g. ['info', 'fullName', 'first'] → 'info.fullName.first'
    const joinedErrorPath = path.join('.')
    console.log('🚀 ~ joinedErrorPath:', joinedErrorPath)

    if (errorPathMap[joinedErrorPath]) {
      errorPaths.add(errorPathMap[joinedErrorPath])
    }

    // Handle missing telephone & mobile
    if (joinedErrorPath === 'contact' && type === 'object.missing') {
      errorPaths.add('phone')
    }
  }

  console.log('🚀 ~ errorPaths:', errorPaths)

  // Convert the set of unique fields into an array
  return Array.from(errorPaths)
}

export {
  validatePersonalDetailsService
}
