/**
 * Validates the personal fix payload data.
 *
 * This service validates the payload for each personal details section the user
 * is fixing (e.g. name, date of birth, email), running each Joi schema separately
 * and collecting any validation errors.
 *
 * The schemas are validated individually rather than being combined into a single
 * Joi schema because combining schemas caused issues with custom validation.
 * In particular, the date of birth schema uses custom validation logic to check
 * for real and valid dates. When schemas were combined, failures in other schemas
 * could prevent this custom date of birth validation from running, meaning some
 * date-related errors were not surfaced.
 *
 * By validating each schema independently (and allowing unknown fields), we ensure
 * that all section-specific validation logic runs correctly and that all relevant
 * errors are returned to the user.
 *
 * @module validatePersonalFixService
 */

import { personalDetailsSchema } from '../../schemas/personal/personal-details-schema.js'

const validatePersonalFixService = (payload, orderedSectionsToFix) => {
  const errors = []

  for (const section of orderedSectionsToFix) {
    const schema = personalDetailsSchema[section]

    const result = schema.validate(payload, { abortEarly: false, allowUnknown: true })

    if (result.error) {
      errors.push(...result.error.details)
    }
  }

  if (errors.length > 0) {
    return {
      error: {
        details: errors
      }
    }
  }

  return { value: payload }
}

export {
  validatePersonalFixService
}
