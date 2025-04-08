import { businessNameChangeRoutes } from './business-name-change.js'
import { businessNameCheckRoutes } from './business-name-check.js'
import { businessDetailsRoutesView } from './business-details.js'

export const businessDetailsRoutes = [
  ...businessNameChangeRoutes,
  ...businessNameCheckRoutes,
  ...businessDetailsRoutesView
]
