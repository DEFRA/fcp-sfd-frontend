import Joi from 'joi'
import {
  PHONE_NUMBER_MIN,
  PHONE_NUMBER_MAX
} from '../../constants/validation-fields.js'

const PHONE_NUMBER_PATTERN = /^[0-9 ()+-]+$/

export const businessPhoneSchema = Joi.object({
  businessTelephone: Joi.string()
    .empty('')
    .min(PHONE_NUMBER_MIN)
    .max(PHONE_NUMBER_MAX)
    .pattern(PHONE_NUMBER_PATTERN)
    .messages({
      'string.min': `Business telephone number must be ${PHONE_NUMBER_MIN} characters or more`,
      'string.max': `Business telephone number must be ${PHONE_NUMBER_MAX} characters or less`,
      'string.pattern.base': 'Business telephone number must only include numbers 0 to 9 and special characters such as spaces, hyphens, brackets, - and +'
    }),
  businessMobile: Joi.string()
    .empty('')
    .min(PHONE_NUMBER_MIN)
    .max(PHONE_NUMBER_MAX)
    .pattern(PHONE_NUMBER_PATTERN)
    .messages({
      'string.min': `Business mobile phone number must be ${PHONE_NUMBER_MIN} characters or more`,
      'string.max': `Business mobile phone number must be ${PHONE_NUMBER_MAX} characters or less`,
      'string.pattern.base': 'Business mobile number must only include numbers 0 to 9 and special characters such as spaces, hyphens, brackets, - and +'
    })
})
  .or('businessTelephone', 'businessMobile')
  .messages({
    'object.missing': 'Enter at least one phone number'
  })
