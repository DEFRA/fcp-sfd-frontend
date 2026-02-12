/**
 * Validates fix payload data for personal or business details.
 *
 * This service validates the payload for each section the user is fixing
 * (e.g. name, date of birth, email, business details), running each provided
 * Joi schema separately and collecting any validation errors.
 *
 * The schemas are passed into the service and validated individually rather
 * than being combined into a single Joi schema. Combining schemas previously
 * caused issues with custom validation logic. For example, the date of birth
 * schema includes custom validation to check for real and valid dates. When
 * schemas were combined, failures in other schemas could prevent this custom
 * validation from running, meaning some errors were not surfaced.
 *
 * By validating each schema independently (and allowing unknown fields), we
 * ensure that all section-specific validation logic runs correctly and that
 * all relevant errors are returned to the user.
 *
 * @module validateFixDetailsService
 */

const validateFixDetailsService = (payload, orderedSectionsToFix, schemas) => {
  const errors = []

  for (const section of orderedSectionsToFix) {
    const schema = schemas[section]

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
  validateFixDetailsService
}
