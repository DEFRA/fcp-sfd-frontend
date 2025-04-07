import Joi from 'joi'

// Create and export a complete schema for each form
export const businessNameSchema = Joi.object({
  businessName: Joi.string()
    .required()
    .max(300)
    .messages({
      'string.empty': 'Enter business name',
      'string.max': 'Business name must be 300 characters or less',
      'any.required': 'Enter business name'
    })
})
