/**
 * Validates a personal details payload against a dynamically constructed Joi
 * schema.
 *
 * This service is used on the Personal Fix page where users may need to correct
 * multiple sections of their personal details. Based on the supplied list of
 * fields the user needs to correct (e.g. name, dob, email, phone, address), the
 * service:
 *
 * 1. Looks up the corresponding Joi schemas from `schemaMap`
 * 2. Combines them into a single Joi object schema
 * 3. Validates the supplied payload against that combined schema
 *
 * This allows us to reuse existing validation schemas while only validating
 * the fields relevant to the sections the user is currently updating.
 * @module validatePersonalFixListService
 */

import Joi from 'joi'
import { schemaMap } from '../../schemas/personal/personal-details-map-schema.js'

const validatePersonalFixListService = (payload, fieldsToRevalidate) => {
  // Get the schemas for the supplied data sections
  const selectedSchemas = getSelectedSchemas(fieldsToRevalidate)

  if (!selectedSchemas.length) {
    throw new Error('validatePersonalFixListService: No valid schemas found for supplied sections')
  }

  // Merge all the schemas into one
  const combinedSchema = buildCombinedSchema(selectedSchemas)

  // Validate the payload against the combined schema
  return combinedSchema.validate(payload, { abortEarly: false })
}

const getSelectedSchemas = (fields) => {
  const schemas = []

  for (const field of fields) {
    const schema = schemaMap[field]

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
  validatePersonalFixListService
}
