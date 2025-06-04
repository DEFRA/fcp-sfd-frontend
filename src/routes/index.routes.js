import { errors } from './errors/index.routes.js'
import { health } from './health.routes.js'
import { home } from './home.routes.js'
import { staticAssetRoutes } from './static-assets.routes.js'
import { cookies } from './cookies.routes.js'
import { footerRoutes } from './footer/index.routes.js'
import { businessRoutes } from './business/index.routes.js'

export const routes = [
  health,
  home,
  cookies,
  ...errors,
  ...staticAssetRoutes,
  ...footerRoutes,
  ...businessRoutes
]
