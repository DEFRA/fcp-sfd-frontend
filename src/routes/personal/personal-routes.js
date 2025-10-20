import { personalDetailsRoutes } from './personal-details-routes.js'
import { personalDobChangeRoutes } from './personal-dob-change-routes.js'
import { personalDobCheckRoutes } from './personal-dob-check-routes.js'
import { personalAddressEnterRoutes } from './personal-address-enter-routes.js'
import { personalAddressCheckRoutes } from './personal-address-check-routes.js'
import { personalAddressChangeRoutes } from './personal-address-change-routes.js'
import { personalAddressSelectRoutes } from './personal-address-select-routes.js'
import { personalPhoneNumbersChangeRoutes } from './personal-phone-numbers-change-routes.js'
import { personalPhoneNumbersCheckRoutes } from './personal-phone-numbers-check-routes.js'
import { personalEmailChangeRoutes } from './personal-email-change-routes.js'
import { personalEmailCheckRoutes } from './personal-email-check-routes.js'

export const personalRoutes = [
  ...personalDetailsRoutes,
  ...personalDobChangeRoutes,
  ...personalDobCheckRoutes,
  ...personalAddressEnterRoutes,
  ...personalAddressCheckRoutes,
  ...personalAddressChangeRoutes,
  ...personalAddressSelectRoutes,
  ...personalPhoneNumbersChangeRoutes,
  ...personalPhoneNumbersCheckRoutes,
  ...personalEmailChangeRoutes,
  ...personalEmailCheckRoutes
]
