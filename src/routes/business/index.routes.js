import { businessNameChangeRoutes } from './business-name-change.routes.js'
import { businessNameCheckRoutes } from './business-name-check.routes.js'
import { getBusinessDetails } from './business-details.routes.js'
import { businessAddressRoutes } from './business-address-enter.routes.js'
import { businessAddressCheckRoutes } from './business-address-check.routes.js'
import { businessPhoneNumbersChangeRoutes } from './business-phone-numbers-change.routes.js'
import { businessPhoneNumbersCheckRoutes } from './business-phone-numbers-check.routes.js'
import { businessEmailChangeRoutes } from './business-email-change.routes.js'
import { businessEmailCheckRoutes } from './business-email-check.routes.js'
import { getBusinessLegalStatusChange } from './business-legal-status-change.routes.js'
import { getBusinessTypeChange } from './business-type-change.routes.js'
import { exampleDalConnectionRoute } from '../example.routes.js'

export const businessDetailsRoutes = [
  getBusinessDetails,
  ...businessNameChangeRoutes,
  ...businessNameCheckRoutes,
  ...businessAddressRoutes,
  ...businessAddressCheckRoutes,
  ...businessPhoneNumbersChangeRoutes,
  ...businessPhoneNumbersCheckRoutes,
  ...businessEmailChangeRoutes,
  ...businessEmailCheckRoutes,
  getBusinessLegalStatusChange,
  getBusinessTypeChange,
  exampleDalConnectionRoute
]
