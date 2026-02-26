import Joi from 'joi'

export const businessOptionalVatSchema = Joi.object({
  vatNumber: Joi.string()
    .pattern(/^\d{9}$/)
    .allow('')
    .optional()
    .messages({
      'string.pattern.base': 'Enter a VAT registration number, like 123456789'
    })
})
