import Joi from 'joi'

const CHOOSE_ADDRESS_ERROR = 'Choose an address'

export const businessAddressesSchema = Joi.object({
  addresses: Joi.string()
    .invalid('display')
    .required()
    .messages({
      'any.required': CHOOSE_ADDRESS_ERROR,
      'string.empty': CHOOSE_ADDRESS_ERROR,
      'any.invalid': CHOOSE_ADDRESS_ERROR
    })
})
