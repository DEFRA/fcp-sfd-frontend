import Joi from 'joi'
import {
  PHONE_NUMBER_MIN,
  PHONE_NUMBER_MAX
} from '../../constants/validation-fields.js'

export const businessPhoneSchema = Joi.object({
  businessTelephone: Joi.number()
    .empty('')
    .min(PHONE_NUMBER_MIN)
    .max(PHONE_NUMBER_MAX)
    .messages({
      'number.min': `Business telephone number must be ${PHONE_NUMBER_MIN} characters or more`,
      'number.max': `Business telephone number must be ${PHONE_NUMBER_MAX} characters or less`,
      'number.base': 'Business telephone number must be numeric'
    }),
  businessMobile: Joi.string()
    .empty('')
    .min(PHONE_NUMBER_MIN)
    .max(PHONE_NUMBER_MAX)
    .messages({
      'string.min': `Business mobile phone number must be ${PHONE_NUMBER_MIN} characters or more`,
      'string.max': `Business mobile phone number must be ${PHONE_NUMBER_MAX} characters or less`
    })
})
  .or('businessTelephone', 'businessMobile')
  .messages({
    'object.missing': 'Enter at least one phone number'
  })
