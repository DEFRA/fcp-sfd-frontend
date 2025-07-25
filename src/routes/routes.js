import { errors } from './errors/index-routes.js'
import { health } from './health-routes.js'
import { index } from './index-routes.js'
import { home } from './home-routes.js'
import { staticAssetRoutes } from './static-assets-routes.js'
import { cookies } from './cookies-routes.js'
import { footerRoutes } from './footer/index-routes.js'
import { businessRoutes } from './business/business-routes.js'
import { auth } from './auth-routes.js'

export const routes = [
  health,
  index,
  home,
  cookies,
  ...auth,
  ...errors,
  ...staticAssetRoutes,
  ...footerRoutes,
  ...businessRoutes
]
