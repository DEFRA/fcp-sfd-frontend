/**
 * Validates business details against the business details schemas.
 *
 * Business details are first mapped into a flat structure that mirrors the
 * validation schemas. Each section-specific Joi schema (e.g. business name,
 * phone, email, and optionally address) is then validated individually rather
 * than being combined into a single schema.
 *
 * Schemas are validated separately to ensure all custom validation logic runs
 * correctly, which may not run reliably when schemas are combined using
 * `Joi.concat`.
 *
 * If validation passes:
 * - `hasValidBusinessDetails` is `true`
 * - `sectionsNeedingUpdate` is an empty array
 *
 * If validation fails:
 * - `hasValidBusinessDetails` is `false`
 * - `sectionsNeedingUpdate` contains the business detail sections
 *   that need to be updated (e.g. `name`, `address`, `phone`, `email`, `vat`)
 *
 * Address validation is only performed when no UPRN is present.
 *
 * This service only performs validation.
 * It does not read from or write to session state.
 *
 * The caller is responsible for handling any interrupter
 * journey behaviour and persisting validation results.
 *
 * @module validateBusinessDetailsService
 */

import { businessDetailsSchema } from '../../schemas/business/business-details-schema.js'

const validateBusinessDetailsService = (businessDetails) => {
  const hasUprn = Boolean(businessDetails.address?.lookup?.uprn)
  const mappedBusinessDetails = mapBusinessDetails(businessDetails, hasUprn)

  const schemasToValidate = getSchemasToValidate(hasUprn, businessDetails.info?.vat)
  const errors = []

  for (const { schema } of schemasToValidate) {
    const result = schema.validate(mappedBusinessDetails, {
      abortEarly: false,
      allowUnknown: true
    })

    if (result.error) {
      errors.push(...result.error.details)
    }
  }

  if (errors.length === 0) {
    return {
      hasValidBusinessDetails: true,
      sectionsNeedingUpdate: []
    }
  }

  return {
    hasValidBusinessDetails: false,
    sectionsNeedingUpdate: mapValidationErrorsToSections(errors)
  }
}

const getSchemasToValidate = (hasUprn, hasVat) => {
  const schemas = [
    { schema: businessDetailsSchema.name },
    { schema: businessDetailsSchema.phone },
    { schema: businessDetailsSchema.email }
  ]

  if(hasVat) {
    schemas.push({ schema: businessDetailsSchema.vat })
  }

  if (!hasUprn) {
    schemas.push({ schema: businessDetailsSchema.address })
  }

  return schemas
}

/**
 * Maps nested business details into a flat structure for validation.
 *
 * The flat shape mirrors the validation schema and avoids duplicating
 * nested schemas. Address fields are only included when no UPRN is present.
 */
const mapBusinessDetails = (businessDetails, hasUprn) => {
  const flatBusinessDetails = {
    businessName: businessDetails.info?.businessName ?? '',
    businessEmail: businessDetails.contact?.email ?? '',
    businessTelephone: businessDetails.contact?.landline ?? '',
    businessMobile: businessDetails.contact?.mobile ?? '',
  }

  // Only include VAT if provided
  if (businessDetails.info?.vat) {
    flatBusinessDetails.vatNumber = businessDetails.info.vat
  }

  if (!hasUprn) {
    flatBusinessDetails.address1 = businessDetails.address?.manual?.line1 ?? ''
    flatBusinessDetails.address2 = businessDetails.address?.manual?.line2 ?? ''
    flatBusinessDetails.address3 = businessDetails.address?.manual?.line3 ?? ''
    flatBusinessDetails.city = businessDetails.address?.manual?.line4 ?? ''
    flatBusinessDetails.county = businessDetails.address?.manual?.line5 ?? ''
    flatBusinessDetails.postcode = businessDetails.address?.postcode ?? ''
    flatBusinessDetails.country = businessDetails.address?.country ?? ''
  }

  return flatBusinessDetails
}

/**
 * Turns validation errors into a list of form sections with problems.
 *
 * If multiple errors relate to the same field, the field is only
 * returned once.
 */
const mapValidationErrorsToSections = (errorDetails) => {
  const errorFieldToSectionMap = {
    vatNumber: 'vat',
    businessName: 'name',
    businessEmail: 'email',
    businessTelephone: 'phone',
    businessMobile: 'phone',
    address1: 'address',
    address2: 'address',
    address3: 'address',
    city: 'address',
    county: 'address',
    postcode: 'address',
    country: 'address'
  }

  // Create a set to store unique error paths
  const sections = new Set()

  for (const { path, type } of errorDetails) {
    const fieldName = path[0]

    if (errorFieldToSectionMap[fieldName]) {
      sections.add(errorFieldToSectionMap[fieldName])
    }

    // Flat-schema phone rule: neither telephone nor mobile provided
    if (path.length === 0 && type === 'object.missing') {
      sections.add('phone')
    }
  }

  // Convert the set of unique fields into an array
  return Array.from(sections)
}

export {
  validateBusinessDetailsService
}
