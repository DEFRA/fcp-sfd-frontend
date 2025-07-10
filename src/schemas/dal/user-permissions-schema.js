import Joi from 'joi'

export const rawUserPermissionsSchema = Joi.object({
  business: Joi.object({
    customer: Joi.object({
      permissionGroups: Joi.array().min(1).items(
        Joi.object({
          id: Joi.string().required(),
          level: Joi.string().required(),
          functions: Joi.array().items(Joi.string())
        })
      ).required()
    }).required()
  }).required()
})
