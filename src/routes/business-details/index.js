import { businessAddressRoutes } from './business-address-enter.js'
import { businessAddressCheckRoutes } from './business-address-check.js'
import { businessDetailsRoutes } from './business-details.js'
import { businessEmailChangeRoutes } from './business-email-change.js'
import { businessEmailCheckRoutes } from './business-email-check.js'
import { businessLegalStatusRoutes } from './business-legal-status-change.js'
import { businessNameChangeRoutes } from './business-name-change.js'
import { businessNameCheckRoutes } from './business-name-check.js'
import { businessPhoneNumbersChangeRoutes } from './business-phone-numbers-change.js'
import { businessPhoneNumbersCheckRoutes } from './business-phone-numbers-check.js'
import { businessTypeRoutes } from './business-type-change.js'

export const businessRoutes = [
  ...businessAddressRoutes,
  ...businessAddressCheckRoutes,
  ...businessDetailsRoutes,
  ...businessEmailChangeRoutes,
  ...businessEmailCheckRoutes,
  ...businessLegalStatusRoutes,
  ...businessNameChangeRoutes,
  ...businessNameCheckRoutes,
  ...businessPhoneNumbersChangeRoutes,
  ...businessPhoneNumbersCheckRoutes,
  ...businessTypeRoutes
]
