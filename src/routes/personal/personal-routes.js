import { personalDetailsRoutes } from './personal-details-routes.js'
import { personalAddressEnterRoutes } from './personal-address-enter-routes.js'
import { personalAddressCheckRoutes } from './personal-address-check-routes.js'
import { personalAddressChangeRoutes } from './personal-address-change-routes.js'
import { personalAddressSelectChangeRoutes } from './personal-address-select-change-routes.js'
import { personalPhoneNumbersChangeRoutes } from './personal-phone-numbers-change-routes.js'
import { personalPhoneNumbersCheckRoutes } from './personal-phone-numbers-check-routes.js'

export const personalRoutes = [
  ...personalDetailsRoutes,
  ...personalAddressEnterRoutes,
  ...personalAddressCheckRoutes,
  ...personalAddressChangeRoutes,
  ...personalAddressSelectChangeRoutes,
  ...personalPhoneNumbersChangeRoutes,
  ...personalPhoneNumbersCheckRoutes
]
