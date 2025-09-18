import Joi from 'joi'
import { FIRST_NAME_MAX } from '../../constants/validation-fields.js'
import { MIDDLE_NAME_MAX } from '../../constants/validation-fields.js'
import { LAST_NAME_MAX } from '../../constants/validation-fields.js'

export const fullNameSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .max(FIRST_NAME_MAX)
    .messages({
      'string.empty': 'Enter a first name',
      'string.max': `First name must be ${FIRST_NAME_MAX} characters or less`
    }),
  middleName: Joi.string()
    .max(MIDDLE_NAME_MAX)
    .allow('')
    .messages({
      'string.max': `Middle name must be ${MIDDLE_NAME_MAX} characters or less`
    }),
  lastName: Joi.string()
    .required()
    .max(LAST_NAME_MAX)
    .messages({
      'string.empty': 'Enter a last name',
      'string.max': `Last name must be ${LAST_NAME_MAX} characters or less`
    })
})

