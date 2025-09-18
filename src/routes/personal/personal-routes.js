import { personalDetailsRoutes } from './personal-details-routes.js'
import { fullNameChangeRoutes } from './full-name-change-routes.js'
import { fullNameCheckRoutes } from './full-name-check-routes.js'

export const personalRoutes = [
  ...personalDetailsRoutes,
  ...fullNameChangeRoutes,
  ...fullNameCheckRoutes
]
