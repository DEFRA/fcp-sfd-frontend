import Joi from 'joi'
import { VAT_MAX } from '../../constants/validation-fields.js'

export const businessVatSchema = Joi.object({
  businessVat: Joi.string()
    .messages({
      'string.empty': 'Enter a VAT registration number',
      'string.vat': 'Enter a VAT registration number in the format GB123456789 or 123456789'
    })
    .required()
})
