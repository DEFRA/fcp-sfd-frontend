/**
 * Central map of business detail schemas.
 *
 * This file brings together all individual business detail schemas
 * into a single lookup object.
 *
 * To add a new business detail schema:
 * 1. Create the schema
 * 2. Import it here
 * 3. Add it to this map
 */

import { businessEmailSchema } from './business-email-schema.js'
import { businessNameSchema } from './business-name-schema.js'
import { addressSchema } from './../address-schema.js'
import { businessPhoneSchema } from './business-phone-schema.js'
import { businessVatSchema } from './business-vat-schema.js'

export const businessDetailsSchema = {
  name: businessNameSchema,
  address: addressSchema,
  phone: businessPhoneSchema,
  email: businessEmailSchema,
  vat: businessVatSchema
}
