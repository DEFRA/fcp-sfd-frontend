import { personalDetailsRoutes } from './personal-details-routes.js'
import { personalDobChangeRoutes } from './personal-dob-change-routes.js'
import { personalDobCheckRoutes } from './personal-dob-check-routes.js'
import { personalPhoneNumbersChangeRoutes } from './personal-phone-numbers-change-routes.js'
import { personalPhoneNumbersCheckRoutes } from './personal-phone-numbers-check-routes.js'

export const personalRoutes = [
  ...personalDetailsRoutes,
  ...personalDobChangeRoutes,
  ...personalDobCheckRoutes,
  ...personalPhoneNumbersChangeRoutes,
  ...personalPhoneNumbersCheckRoutes
]
