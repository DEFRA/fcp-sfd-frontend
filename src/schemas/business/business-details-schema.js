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

import { schemas } from '@defra/fcp-sfd-frontend-engine'

import { businessEmailSchema } from './business-email-schema.js'
import { businessNameSchema } from './business-name-schema.js'
import { businessPhoneSchema } from './business-phone-schema.js'
import { businessOptionalVatSchema } from './business-optional-vat-schema.js'

export const businessDetailsSchema = {
  name: businessNameSchema,
  address: schemas.business.address,
  phone: businessPhoneSchema,
  email: businessEmailSchema,
  vat: businessOptionalVatSchema
}
