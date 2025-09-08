import Joi from 'joi'
import { EMAIL_MAX } from '../../constants/validation-fields.js'

export const businessEmailSchema = Joi.object({
  businessEmail: Joi.string()
    .required()
    .max(EMAIL_MAX)
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: true,
        min: 2
      }
    })
    .messages({
      'string.max': `Business email address must be ${EMAIL_MAX} characters or less`,
      'string.empty': 'Enter business email address',
      'string.email': 'Enter an email address, like name@example.com'
    })
})
