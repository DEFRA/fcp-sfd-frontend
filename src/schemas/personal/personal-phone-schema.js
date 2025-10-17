import Joi from 'joi'
import {
  PHONE_NUMBER_MIN,
  PHONE_NUMBER_MAX
} from '../../constants/validation-fields.js'

export const personalPhoneSchema = Joi.object({
  personalTelephone: Joi.string()
    .empty('')
    .min(PHONE_NUMBER_MIN)
    .max(PHONE_NUMBER_MAX)
    .messages({
      'string.min': `Personal telephone number must be ${PHONE_NUMBER_MIN} characters or more`,
      'string.max': `Personal telephone number must be ${PHONE_NUMBER_MAX} characters or less`
    }),
  personalMobile: Joi.string()
    .empty('')
    .min(PHONE_NUMBER_MIN)
    .max(PHONE_NUMBER_MAX)
    .messages({
      'string.min': `Personal mobile phone number must be ${PHONE_NUMBER_MIN} characters or more`,
      'string.max': `Personal mobile phone number must be ${PHONE_NUMBER_MAX} characters or less`
    })
})
  .or('personalTelephone', 'personalMobile')
  .messages({
    'object.missing': 'Enter at least one phone number'
  })
