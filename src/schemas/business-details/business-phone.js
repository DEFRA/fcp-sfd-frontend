import Joi from 'joi'
import {
  BUSINESS_PHONE_NUMBER_MIN,
  BUSINESS_PHONE_NUMBER_MAX
} from '../../constants/validation-fields.js'

export const businessPhoneSchema = Joi.object({
  businessTelephone: Joi.string()
    .empty('')
    .min(BUSINESS_PHONE_NUMBER_MIN)
    .max(BUSINESS_PHONE_NUMBER_MAX)
    .messages({
      'string.min': `Business telephone number must be ${BUSINESS_PHONE_NUMBER_MIN} characters or more`,
      'string.max': `Business telephone number must be ${BUSINESS_PHONE_NUMBER_MAX} characters or less`
    }),
  businessMobile: Joi.string()
    .empty('')
    .min(BUSINESS_PHONE_NUMBER_MIN)
    .max(BUSINESS_PHONE_NUMBER_MAX)
    .messages({
      'string.min': `Business mobile phone number must be ${BUSINESS_PHONE_NUMBER_MIN} characters or more`,
      'string.max': `Business mobile phone number must be ${BUSINESS_PHONE_NUMBER_MAX} characters or less`
    })
})
  .or('businessTelephone', 'businessMobile')
  .messages({
    'object.missing': 'Enter at least one phone number'
  })