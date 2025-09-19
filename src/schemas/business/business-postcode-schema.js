import Joi from 'joi'
import { POSTCODE_MAX } from '../../constants/validation-fields.js'

export const businessPostcodeSchema = Joi.object({
  businessPostcode: Joi.string()
    .required()
    .max(POSTCODE_MAX)
    .messages({
      'any.required': 'Enter a postal code or zip code',
      'string.empty': 'Enter a postal code or zip code',
      'string.max': `Postal code or zip code must be ${POSTCODE_MAX} characters or less`
    })
})
