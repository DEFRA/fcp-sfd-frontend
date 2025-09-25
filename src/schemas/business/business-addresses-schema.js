import Joi from 'joi'

export const businessAddressesSchema = Joi.object({
  addresses: Joi.string()
    .invalid('display')
    .required()
    .messages({
      'any.required': 'Choose an address',
      'string.empty': 'Choose an address',
      'any.invalid': 'Choose an address'
    })
})
