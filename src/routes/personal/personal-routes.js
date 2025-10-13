import { personalDetailsRoutes } from './personal-details-routes.js'
import { personalPhoneNumbersChangeRoutes } from './personal-phone-numbers-change-routes.js'
import { personalPhoneNumbersCheckRoutes } from './personal-phone-numbers-check-routes.js'
import { personalEmailChangeRoutes } from './personal-email-change-routes.js'
import { personalEmailCheckRoutes } from './personal-email-check-routes.js'

export const personalRoutes = [
  ...personalDetailsRoutes,
  ...personalPhoneNumbersChangeRoutes,
  ...personalPhoneNumbersCheckRoutes,
  ...personalEmailChangeRoutes,
  ...personalEmailCheckRoutes
]
