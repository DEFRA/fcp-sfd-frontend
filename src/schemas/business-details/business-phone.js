import Joi from 'joi'
import { 
  BUSINESS_PHONE_NUMBER_MIN, 
  BUSINESS_PHONE_NUMBER_MAX 
} from '../../constants/validation-fields.js'

export const businessPhoneSchema = Joi.object({
  businessTelephone: Joi.string()
    .min(BUSINESS_PHONE_NUMBER_MIN)
    .max(BUSINESS_PHONE_NUMBER_MAX)
    .messages({
      'string.empty': 'Enter business phone number',
      'string.max': `Business phone number must be between ${BUSINESS_PHONE_NUMBER_MIN} and ${BUSINESS_PHONE_NUMBER_MAX}`,
      'any.required': 'Enter business phone number'
    }),
  businessMobile: Joi.string()
    .min(BUSINESS_PHONE_NUMBER_MIN)
    .max(BUSINESS_PHONE_NUMBER_MAX)
    .messages({
      'string.empty': 'Enter business phone number',
      'string.max': `Business phone number must be between ${BUSINESS_PHONE_NUMBER_MIN} and ${BUSINESS_PHONE_NUMBER_MAX}`,
      'any.required': 'Enter business phone number'
    })
})
.or('businessTelephone', 'businessMobile')
.messages({
  'object.missing': 'Enter at least one business phone number'
})