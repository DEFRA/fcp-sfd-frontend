import Joi from 'joi'
import { 
  BUSINESS_PHONE_NUMBER_MIN, 
  BUSINESS_PHONE_NUMBER_MAX 
} from '../../constants/validation-fields.js'

export const businessPhoneSchema = Joi.object({
  businessTelephone: Joi.string()
    .required()
    .min(BUSINESS_PHONE_NUMBER_MIN)
    .max(BUSINESS_PHONE_NUMBER_MAX)
    .messages({
      'string.empty': 'Enter business phone number',
      'string.max': `Business phone number must be between ${BUSINESS_PHONE_NUMBER_MIN} and ${BUSINESS_PHONE_NUMBER_MAX}`,
      'any.required': 'Enter business phone number'
    }),
  businessMobile: Joi.string()
    .required()
    .min(BUSINESS_PHONE_NUMBER_MIN)
    .max(BUSINESS_PHONE_NUMBER_MAX)
    .messages({
      'string.empty': 'Enter business phone number',
      'string.max': `Business phone number must be between ${BUSINESS_PHONE_NUMBER_MIN} and ${BUSINESS_PHONE_NUMBER_MAX}`,
      'any.required': 'Enter business phone number'
    })
})

/**
 * both businessTelephone and businessMobile are marked as "required" above, 
 * but considering only one is needed not sure how to configure this
 */