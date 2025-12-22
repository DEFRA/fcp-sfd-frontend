import Joi from 'joi'

import {
  FIRST_NAME_MAX,
  LAST_NAME_MAX,
  MIDDLE_NAMES_MAX
} from '../../constants/validation-fields.js'

export const personalDetailsSchema = Joi.object({
  info: Joi.object({
    fullName: Joi.object({
      first: Joi.string().required().max(FIRST_NAME_MAX),
      last: Joi.string().required().max(LAST_NAME_MAX),
      middle: Joi.string().allow(null, '').max(MIDDLE_NAMES_MAX)
    }),
    dateOfBirth: Joi.date().required()
  }).unknown(true),
  contact: Joi.object({
    email: Joi.string().email().required(),
    telephone: Joi.string().empty(null, '').optional(),
    mobile: Joi.string().empty(null, '').optional()
  }).or('telephone', 'mobile'),
  address: Joi.object({
    lookup: Joi.object({
      buildingNumberRange: Joi.any().allow(null),
      flatName: Joi.any().allow(null),
      buildingName: Joi.string().allow(null, ''),
      street: Joi.string().allow(null, ''),
      city: Joi.string().allow(null, ''),
      county: Joi.string().allow(null, ''),
      uprn: Joi.string().allow(null)
    }),
    manual: Joi.object({
      line1: Joi.string().allow(null, ''),
      line2: Joi.string().allow(null, ''),
      line3: Joi.string().allow(null, ''),
      line4: Joi.string().allow(null, ''),
      line5: Joi.string().allow(null, '')
    }),
    postcode: Joi.string().allow(null, ''),
    country: Joi.string().allow(null, '')
  }).custom((value, helpers) => {
    const uprn = value.lookup?.uprn

    // If UPRN is provided no further validation needed
    if (uprn) {
      return value
    }

    // Otherwise enforce manual address requirements
    if (!value.manual?.line1) {
      return helpers.error('any.custom', { message: 'Enter address line 1' })
    }

    const city = value.manual?.line4
    if (!city) {
      return helpers.error('any.custom', { message: 'Enter a city or town' })
    }

    if (!value.postcode) {
      return helpers.error('any.custom', { message: 'Enter a postcode' })
    }

    if (!value.country) {
      return helpers.error('any.custom', { message: 'Enter a country' })
    }

    return value
  })
}).unknown(true)
