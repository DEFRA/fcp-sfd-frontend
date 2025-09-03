import Joi from 'joi'

export const businessVatSchema = Joi.object({
  vatNumber: Joi.string()
    .pattern(/^\d{9}$/)
    .messages({
      'string.pattern.base': 'Enter a VAT registration number in the format 123456789',
      'string.empty': 'Enter a VAT registration number'
    })
    .required()
})
