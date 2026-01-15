/**
 * Validates personal details against the personal details schema.
 *
 * If validation passes:
 * - `hasValidPersonalDetails` is `true`
 * - `sectionsNeedingUpdate` is an empty array
 *
 * If validation fails:
 * - `hasValidPersonalDetails` is `false`
 * - `sectionsNeedingUpdate` contains the personal detail sections
 *   that need to be updated (e.g. `name`, `address`, `phone`)
 *
 * This service only performs validation.
 * It does not read from or write to session state.
 *
 * The caller is responsible for handling any interrupter
 * journey behaviour and persisting validation results.
 *
 * @module validatePersonalDetailsService
 */

import { personalDetailsSchema } from '../../schemas/personal/personal-details-schema.js'

const validatePersonalDetailsService = (personalDetails) => {
  const { error } = personalDetailsSchema.validate(personalDetails, { abortEarly: false })

  if (!error) {
    return {
      hasValidPersonalDetails: true,
      sectionsNeedingUpdate: []
    }
  }

  const sectionsNeedingUpdate = mapErrorPaths(error.details)

  return {
    hasValidPersonalDetails: false,
    sectionsNeedingUpdate
  }
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
    // Join the path segments into a single string e.g. ['info', 'fullName', 'first'] → 'info.fullName.first'
    const joinedErrorPath = path.join('.')

    if (errorPathMap[joinedErrorPath]) {
      errorPaths.add(errorPathMap[joinedErrorPath])
    }

    // Handle missing telephone & mobile
    if (joinedErrorPath === 'contact' && type === 'object.missing') {
      errorPaths.add('phone')
    }
  }

  // Convert the set of unique fields into an array
  return Array.from(errorPaths)
}

export {
  validatePersonalDetailsService
}
