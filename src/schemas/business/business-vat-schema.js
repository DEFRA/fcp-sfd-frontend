import Joi from 'joi'

export const businessVatSchema = Joi.object({
  vatNumber: Joi.string()
    .pattern(/^\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Enter a VAT registration number, like 123456789',
      'string.empty': 'Enter a VAT registration number',
      'any.required': 'Enter a VAT registration number' // 👈 Add this line
    })
})
