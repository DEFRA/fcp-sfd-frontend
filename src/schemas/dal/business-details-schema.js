import Joi from 'joi'

export const rawBusinessDetailsSchema = Joi.object({
  business: Joi.object({
    organisationId: Joi.string().required(),
    sbi: Joi.string().required(),
    info: Joi.object({
      name: Joi.string().required(),
      vat: Joi.string().required(),
      traderNumber: Joi.string().required(),
      vendorNumber: Joi.string().required(),
      legalStatus: Joi.object({
        code: Joi.number().required(),
        type: Joi.string().required()
      }),
      type: Joi.object({
        code: Joi.number().required(),
        type: Joi.string().required()
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
      email: Joi.object({
        address: Joi.string().required()
      }),
      phone: Joi.object({
        mobile: Joi.string().allow(null),
        landline: Joi.string().allow(null)
      })
    })
  }).required(),
  customer: Joi.object({
    info: Joi.object({
      name: Joi.object({
        title: Joi.string().required(),
        first: Joi.string().required(),
        last: Joi.string().required()
      })
    })
  }).required()
})
