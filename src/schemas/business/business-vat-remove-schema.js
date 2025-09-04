import Joi from 'joi'

export const businessVatRemoveSchema = Joi.object({
  confirmRemove: Joi.string()
    .valid('yes', 'no')
    .required()
    .messages({
      'any.required': 'Select yes if you want to remove your VAT registration number',
      'any.only': 'Select yes if you want to remove your VAT registration number'
    })
})
