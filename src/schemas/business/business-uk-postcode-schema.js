import Joi from 'joi'
import { POSTCODE_MAX } from '../../constants/validation-fields.js'

export const businessUkPostcodeSchema = Joi.object({
  businessPostcode: Joi.string()
    .required()
    .uppercase()
    .max(POSTCODE_MAX)
    .pattern(/^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/)
    .messages({
      'any.required': 'Enter a postal code or zip code',
      'string.empty': 'Enter a postal code or zip code',
      'string.max': `Postal code or zip code must be ${POSTCODE_MAX} characters or less`,
      'string.pattern.base': 'Enter a full UK postcode, like AA3 1AB'
    })
})
