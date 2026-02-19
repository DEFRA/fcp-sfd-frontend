import { health } from './health-routes.js'
import { auth } from './auth-routes.js'
import { homeRoutes } from './home-routes.js'
import { errors } from './errors/error-routes.js'
import { signedOut } from './signed-out-routes.js'
import { staticAssetRoutes } from './static-assets-routes.js'
import { footerRoutes } from './footer/footer-routes.js'
import { businessRoutes } from './business/business-routes.js'
import { personalRoutes } from './personal/personal-routes.js'

export const routes = [
  health,
  ...auth,
  ...homeRoutes,
  ...errors,
  signedOut,
  ...staticAssetRoutes,
  ...footerRoutes,
  ...businessRoutes,
  ...personalRoutes
]
