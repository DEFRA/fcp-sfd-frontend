import Joi from 'joi'

export const cookiesSchema = Joi.object({
  analytics: Joi.boolean()
    .required()
    .messages({
      'any.required': 'Select yes if you want to accept analytics cookies',
      'boolean.base': 'Select yes if you want to accept analytics cookies'
    }),
  async: Joi.boolean().default(false),
  referer: Joi.string().allow('').default('')
})
