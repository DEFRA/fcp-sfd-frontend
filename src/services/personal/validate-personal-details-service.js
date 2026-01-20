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
import Joi from 'joi'

const validatePersonalDetailsService = (personalDetails) => {
  const hasUprn = Boolean(personalDetails.address?.lookup?.uprn)
  const schema = getPersonalDetailsSchema(hasUprn)

  const mappedPersonalDetails = mapPersonalDetails(personalDetails, hasUprn)
  const { error } = schema.validate(mappedPersonalDetails, { abortEarly: false })

  if (!error) {
    return {
      hasValidPersonalDetails: true,
      sectionsNeedingUpdate: []
    }
  }

  const sectionsNeedingUpdate = mapValidationErrorsToSections(error.details)

  return {
    hasValidPersonalDetails: false,
    sectionsNeedingUpdate
  }
}

/**
 * Maps nested personal details into a flat structure for validation.
 *
 * The flat shape mirrors the validation schema and avoids duplicating
 * nested schemas. Address fields are only included when no UPRN is present.
 */
const mapPersonalDetails = (personalDetails, hasUprn) => {
  const flatPersonalDetails = {
    first: personalDetails.info?.fullName?.first ?? '',
    last: personalDetails.info?.fullName?.last ?? '',
    middle: personalDetails.info?.fullName?.middle ?? '',
    day: personalDetails.info?.dateOfBirth?.day ?? '',
    month: personalDetails.info?.dateOfBirth?.month ?? '',
    year: personalDetails.info?.dateOfBirth?.year ?? '',
    personalEmail: personalDetails.contact?.email ?? '',
    personalTelephone: personalDetails.contact?.telephone ?? '',
    personalMobile: personalDetails.contact?.mobile ?? ''
  }

  if (!hasUprn) {
    flatPersonalDetails.address1 = personalDetails.address?.manual?.line1 ?? ''
    flatPersonalDetails.address2 = personalDetails.address?.manual?.line2 ?? ''
    flatPersonalDetails.address3 = personalDetails.address?.manual?.line3 ?? ''
    flatPersonalDetails.city = personalDetails.address?.manual?.line4 ?? ''
    flatPersonalDetails.county = personalDetails.address?.manual?.line5 ?? ''
    flatPersonalDetails.postcode = personalDetails.address?.postcode ?? ''
    flatPersonalDetails.country = personalDetails.address?.country ?? ''
  }

  return flatPersonalDetails
}

const getPersonalDetailsSchema = (hasUprn) => {
  let schema = Joi.object()
    .concat(personalDetailsSchema.name)
    .concat(personalDetailsSchema.dob)
    .concat(personalDetailsSchema.phone)
    .concat(personalDetailsSchema.email)

  if (!hasUprn) {
    schema = schema.concat(personalDetailsSchema.address)
  }

  return schema
}

/**
 * Turns validation errors into a list of form sections with problems.
 *
 * If multiple errors relate to the same field, the field is only
 * returned once.
 */
const mapValidationErrorsToSections = (errorDetails) => {
  const errorFieldToSectionMap = {
    first: 'name',
    last: 'name',
    middle: 'name',
    day: 'dob',
    month: 'dob',
    year: 'dob',
    personalEmail: 'email',
    personalTelephone: 'phone',
    personalMobile: 'phone',
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
  validatePersonalDetailsService
}
