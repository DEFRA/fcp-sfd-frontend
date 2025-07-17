import Joi from 'joi'

export const rawPersonalDetailsSchema = Joi.object({
  personal: Joi.object({
    crn: Joi.string().required(),
    info: Joi.object({
      dateOfBirth: Joi.string().required(),
      name: Joi.object({
        title: Joi.string().required(),
        first: Joi.string().required(),
        last: Joi.string().required(),
        middle: Joi.string().allow(null)
      }),
      address: Joi.object({
        buildingNumberRange: Joi.string().allow(null),
        buildingName: Joi.string().allow(null),
        flatName: Joi.string().allow(null),
        street: Joi.string().allow(null),
        city: Joi.string().allow(null),
        county: Joi.string().allow(null),
        postalCode: Joi.string().required(),
        country: Joi.string().required(),
        dependentLocality: Joi.string().allow(null),
        doubleDependentLocality: Joi.string().allow(null),
        line1: Joi.string().allow(null),
        line2: Joi.string().allow(null),
        line3: Joi.string().allow(null),
        line4: Joi.string().allow(null),
        line5: Joi.string().allow(null)
      }),
    })
  }).required()
}).required()