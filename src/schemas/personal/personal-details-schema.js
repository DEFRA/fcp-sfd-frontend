/**
 * Central map of personal detail schemas.
 *
 * This file brings together all individual personal detail schemas
 * into a single lookup object.
 *
 * To add a new personal detail schema:
 * 1. Create the schema
 * 2. Import it here
 * 3. Add it to this map
 */

import { personalNameSchema } from './personal-name-schema.js'
import { personalDobSchema } from './personal-dob-schema.js'
import { addressSchema } from './../address-schema.js'
import { personalEmailSchema } from './personal-email-schema.js'
import { personalPhoneSchema } from './personal-phone-schema.js'

export const personalDetailsSchema = {
  name: personalNameSchema,
  dob: personalDobSchema,
  address: addressSchema,
  phone: personalPhoneSchema,
  email: personalEmailSchema
}
