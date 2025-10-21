import Joi from 'joi'
import {
  FIRST_NAME_MAX,
  LAST_NAME_MAX,
  MIDDLE_NAME_MAX
} from '../../constants/validation-fields.js'

export const personalNameSchema = Joi.object({
  first: Joi.string()
    .required()
    .max(FIRST_NAME_MAX)
    .messages({
      'string.empty': 'Enter first name',
      'string.max': `First name must be ${FIRST_NAME_MAX} characters or less`,
      'any.required': 'Enter first name'
    }),
  last: Joi.string()
    .required()
    .max(LAST_NAME_MAX)
    .messages({
      'string.empty': 'Enter last name',
      'string.max': `Last name must be ${LAST_NAME_MAX} characters or less`,
      'any.required': 'Enter last name'
    }),
  middle: Joi.string()
    .allow('')
    .max(MIDDLE_NAME_MAX)
    .messages({
      'string.max': `Middle name must be ${MIDDLE_NAME_MAX} characters or less`
    })
})
