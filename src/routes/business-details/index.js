import { businessNameChangeRoutes } from './business-name-change.js'
import { businessNameCheckRoutes } from './business-name-check.js'
import { businessDetailsRoutesView } from './business-details.js'
import { businessAddressRoutes } from './business-address-form.js'

export const businessDetailsRoutes = [
  ...businessNameChangeRoutes,
  ...businessNameCheckRoutes,
  ...businessDetailsRoutesView,
  ...businessAddressRoutes
]
