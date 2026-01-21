/**
 * Validates a personal details fix payload against a dynamically constructed Joi
 * schema.
 *
 * This service is used on the Personal Fix page where users may need to correct
 * multiple sections of their personal details. Based on the supplied list of
 * sections the user needs to correct (e.g. name, dob, email, phone, address), the
 * service:
 *
 * 1. Looks up the corresponding Joi schemas from `personalDetailsSchema`
 * 2. Combines them into a single Joi object schema
 * 3. Validates the supplied payload against that combined schema
 *
 * This allows us to reuse existing validation schemas while only validating
 * the fields relevant to the sections the user is currently updating.
 * @module validatePersonalFixService
 */

import Joi from 'joi'
import { personalDetailsSchema } from '../../schemas/personal/personal-details-schema.js'

const validatePersonalFixService = (payload, orderedSectionsToFix) => {
  // Get the schemas for the supplied data sections
  const selectedSchemas = getSelectedSchemas(orderedSectionsToFix)

  // Merge all the schemas into one
  const combinedSchema = buildCombinedSchema(selectedSchemas)

  // Validate the payload against the combined schema
  return combinedSchema.validate(payload, { abortEarly: false })
}

const getSelectedSchemas = (orderedSectionsToFix) => {
  const schemas = []

  for (const section of orderedSectionsToFix) {
    const schema = personalDetailsSchema[section]

    if (schema) {
      schemas.push(schema)
    }
  }

  return schemas
}

/**
 * Combines multiple Joi object schemas into a single schema
 * while preserving their validation rules.
 *
 * Joi.concat merges two Joi schemas together to form a single schema that applies all of the rules from both
 */
const buildCombinedSchema = (schemas) => {
  let combinedSchema = Joi.object()

  for (const schema of schemas) {
    combinedSchema = combinedSchema.concat(schema)
  }

  return combinedSchema
}

export {
  validatePersonalFixService
}
