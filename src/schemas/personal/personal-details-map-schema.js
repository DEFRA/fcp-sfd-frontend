import { personalNameSchema } from './personal-name-schema.js'
import { personalDobSchema } from './personal-dob-schema.js'
import { addressSchema } from './../address-schema.js'
import { personalEmailSchema } from './personal-email-schema.js'
import { personalPhoneSchema } from './personal-phone-schema.js'

export const schemaMap = {
  name: personalNameSchema,
  dob: personalDobSchema,
  address: addressSchema,
  phone: personalPhoneSchema,
  email: personalEmailSchema
}
