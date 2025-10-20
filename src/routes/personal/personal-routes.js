import { personalDetailsRoutes } from './personal-details-routes.js'
import { personalNameChangeRoutes } from './personal-name-change-routes.js'
import { personalNameCheckRoutes } from './personal-name-check-routes.js'
import { personalPhoneNumbersChangeRoutes } from './personal-phone-numbers-change-routes.js'
import { personalPhoneNumbersCheckRoutes } from './personal-phone-numbers-check-routes.js'

export const personalRoutes = [
  ...personalDetailsRoutes,
  ...personalNameChangeRoutes,
  ...personalNameCheckRoutes,
  ...personalPhoneNumbersChangeRoutes,
  ...personalPhoneNumbersCheckRoutes
]
