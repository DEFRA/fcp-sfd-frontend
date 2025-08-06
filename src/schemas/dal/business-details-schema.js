import Joi from 'joi'

import { addressSchema } from './address-schema.js'
import { phoneSchema } from './phones-schema.js'

export const rawBusinessDetailsSchema = Joi.object({
  business: Joi.object({
    organisationId: Joi.string().required(),
    sbi: Joi.string().required(),
    countyParishHoldings: Joi.array().items(
      Joi.object({
        cphNumber: Joi.string().allow(null)
      })
    ).required(),
    info: Joi.object({
      name: Joi.string().required(),
      vat: Joi.string().allow(null),
      traderNumber: Joi.string().allow(null),
      vendorNumber: Joi.string().allow(null),
      legalStatus: Joi.object({
        code: Joi.number().required(),
        type: Joi.string().required()
      }),
      type: Joi.object({
        code: Joi.number().required(),
        type: Joi.string().required()
      }),
      address: addressSchema,
      email: Joi.object({
        address: Joi.string().required()
      }),
      phone: phoneSchema
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
