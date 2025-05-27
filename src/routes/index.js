import { errors } from './errors/index.js'
import { health } from './health.js'
import { home } from './home.js'
import { staticAssetRoutes } from './static-assets.js'
import { cookies } from './cookies.js'
import { footerRoutes } from './footer/index.js'
import { businessDetailsRoutes } from './business-details/index.js'
import { newBusinessDetailsRoutes } from './business-details.routes.js'

export const routes = [
  health,
  home,
  cookies,
  ...errors,
  ...staticAssetRoutes,
  ...footerRoutes,
  ...businessDetailsRoutes,
  ...newBusinessDetailsRoutes
]
