import Joi from 'joi'
import {
  PHONE_NUMBER_MIN,
  PHONE_NUMBER_MAX
} from '../../constants/validation-fields.js'

const PHONE_NUMBER_PATTERN = /^[0-9 ()+-]+$/

export const personalPhoneSchema = Joi.object({
  personalTelephone: Joi.string()
    .empty('')
    .min(PHONE_NUMBER_MIN)
    .max(PHONE_NUMBER_MAX)
    .pattern(PHONE_NUMBER_PATTERN)
    .messages({
      'string.min': `Personal telephone number must be ${PHONE_NUMBER_MIN} characters or more`,
      'string.max': `Personal telephone number must be ${PHONE_NUMBER_MAX} characters or less`,
      'string.pattern.base': 'Personal telephone number must only include numbers 0 to 9 and special characters such as spaces, hyphens, brackets, - and +'
    }),
  personalMobile: Joi.string()
    .empty('')
    .min(PHONE_NUMBER_MIN)
    .max(PHONE_NUMBER_MAX)
    .pattern(PHONE_NUMBER_PATTERN)
    .messages({
      'string.min': `Personal mobile phone number must be ${PHONE_NUMBER_MIN} characters or more`,
      'string.max': `Personal mobile phone number must be ${PHONE_NUMBER_MAX} characters or less`,
      'string.pattern.base': 'Personal mobile number must only include numbers 0 to 9 and special characters such as spaces, hyphens, brackets, - and +'
    })
})
  .or('personalTelephone', 'personalMobile')
  .messages({
    'object.missing': 'Enter at least one phone number'
  })
