import Joi from 'joi'

import { addressSchema } from './address-schema.js'
import { phoneSchema } from './phones-schema.js'

export const rawPersonalDetailsSchema = Joi.object({
  customer: Joi.object({
    crn: Joi.string().required(),
    info: Joi.object({
      dateOfBirth: Joi.string().required(),
      name: Joi.object({
        title: Joi.string().required(),
        first: Joi.string().required(),
        last: Joi.string().required(),
        middle: Joi.string().allow(null)
      }),
      phone: phoneSchema,
      email: Joi.object({
        address: Joi.string().email().required()
      }),
      address: addressSchema
    })
  }).required()
}).required()
