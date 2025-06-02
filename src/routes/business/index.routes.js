import { businessNameChangeRoutes } from './business-name-change.routes.js'
import { businessAddressCheckRoutes } from './business-address-check.routes.js/index.js'
import { businessNameCheckRoutes } from './business-name-check.routes.js'
import { businessDetailsRoutes } from './details.routes.js'
import { businessAddressRoutes } from './business-address-enter.routes.js'
import { businessPhoneNumbersChangeRoutes } from './business-phone-numbers-change.routes.js'
import { businessPhoneNumbersCheckRoutes } from './business-phone-numbers-check.routes.js'
import { businessEmailChangeRoutes } from './business-email-change.routes.js'
import { businessEmailCheckRoutes } from './business-email-check.routes.js'
import { businessLegalStatusRoutes } from './business-legal-status-change.routes.js'
import { businessTypeRoutes } from './business-type-change.routes.js'

export const businessRoutes = [
  ...businessDetailsRoutes,
  ...businessNameChangeRoutes,
  ...businessNameCheckRoutes,
  ...businessAddressRoutes,
  ...businessAddressCheckRoutes,
  ...businessPhoneNumbersChangeRoutes,
  ...businessPhoneNumbersCheckRoutes,
  ...businessEmailChangeRoutes,
  ...businessEmailCheckRoutes,
  ...businessLegalStatusRoutes,
  ...businessTypeRoutes
]
