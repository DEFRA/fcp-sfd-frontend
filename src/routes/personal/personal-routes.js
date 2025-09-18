import { personalDetailsRoutes } from './personal-details-routes.js'
import { personalPhoneNumbersChangeRoutes } from './personal-phone-numbers-change-routes.js'

export const personalRoutes = [
  ...personalDetailsRoutes,
  ...personalPhoneNumbersChangeRoutes
]
