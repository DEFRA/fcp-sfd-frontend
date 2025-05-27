/**
 * Validates data submitted for the `/business-details/address` page
 * @module AddressSchema
 */

import Joi from 'joi'
import {
  ADDRESS_LINE_MAX,
  TOWN_CITY_MAX,
  COUNTY_MAX,
  POSTCODE_MAX,
  COUNTRY_MAX
} from '../../constants/validation-fields.js'

/**
 * Validates data submitted from the `/business-details/address` page
 *
 * @param {object} payload - The payload from the request to be validated
 *
 * @returns {object} the result from calling Joi's schema.validate(). It will be an object with a `value:` property. If
 * any errors are found the `error:` property will also exist detailing what the issues were
 */
function go (payload) {
    const schema = Joi.object({
    address1: Joi.string()
      .required()
      .max(ADDRESS_LINE_MAX)
      .messages({
        'string.empty': 'Enter address line 1, typically the building and street',
        'string.max': `Address line 1 must be ${ADDRESS_LINE_MAX} characters or less`,
        'any.required': 'Enter address line 1, typically the building and street'
      }),

    address2: Joi.string()
      .allow('')
      .max(ADDRESS_LINE_MAX)
      .messages({
        'string.max': `Address line 2 must be ${ADDRESS_LINE_MAX} characters or less`
      }),

    addressCity: Joi.string()
      .required()
      .max(TOWN_CITY_MAX)
      .messages({
        'string.empty': 'Enter town or city',
        'string.max': `Town or city must be ${TOWN_CITY_MAX} characters or less`,
        'any.required': 'Enter town or city'
      }),

    addressCounty: Joi.string()
      .allow('')
      .max(COUNTY_MAX)
      .messages({
        'string.max': `County must be ${COUNTY_MAX} characters or less`
      }),

    addressPostcode: Joi.string()
      .allow('')
      .max(POSTCODE_MAX)
      .messages({
        'string.max': `Postal code or zip code must be ${POSTCODE_MAX} characters or less`
      }),

    addressCountry: Joi.string()
      .required()
      .max(COUNTRY_MAX)
      .messages({
        'string.empty': 'Enter a country',
        'string.max': `Country must be ${COUNTRY_MAX} characters or less`,
        'any.required': 'Enter a country'
      })
  })

  return schema.validate(payload, { abortEarly: false })
}

export const AddressSchema = {
  go
}
