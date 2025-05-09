import { businessNameChangeRoutes } from './business-name-change.js'
import { businessNameCheckRoutes } from './business-name-check.js'
import { getBusinessDetails } from './business-details.js'
import { businessAddressRoutes } from './business-address-enter.js'
import { businessAddressCheckRoutes } from './business-address-check.js'
import { businessPhoneNumbersChangeRoutes } from './business-phone-numbers-change.js'
import { businessPhoneNumbersCheckRoutes } from './business-phone-numbers-check.js'
import { businessEmailChangeRoutes } from './business-email-change.js'
import { businessEmailCheckRoutes } from './business-email-check.js'
import { getBusinessLegalStatusChange } from './business-legal-status-change.js'
import { getBusinessTypeChange } from './business-type-change.js'

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
  getBusinessTypeChange
]
