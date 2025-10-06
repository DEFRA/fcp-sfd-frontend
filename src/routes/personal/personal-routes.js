import { personalDetailsRoutes } from './personal-details-routes.js'
import { personalDobEnterRoutes } from './personal-dob-enter-routes.js'
import { personalDobCheckRoutes } from './personal-dob-check-routes.js'

export const personalRoutes = [
  ...personalDetailsRoutes,
  ...personalDobEnterRoutes,
  ...personalDobCheckRoutes
]
