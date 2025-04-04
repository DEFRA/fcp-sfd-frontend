import Joi from 'joi'

export const businessNameValidation = {
  businessName: Joi.string()
    .required()
    .max(300)
    .messages({
      'string.empty': 'Enter business name',
      'string.max': 'Business name must be 300 characters or less',
      'any.required': 'Enter business name'
    })
}

export const businessDetailsSchema = {
  businessNameValidation
}
