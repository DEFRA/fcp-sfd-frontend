import { health } from './health-routes.js'
import { authRoutes } from './auth-routes.js'
import { homeRoutes } from './home-routes.js'
import { errors } from './errors/error-routes.js'
import { signedOut } from './signed-out-routes.js'
import { staticAssetRoutes } from './static-assets-routes.js'
import { footerRoutes } from './footer/footer-routes.js'
import { businessRoutes } from './business/business-routes.js'
import { personalRoutes } from './personal/personal-routes.js'
import { catchAllNotFound } from './catch-all-routes.js'
import { bankDetailsRoutes } from './bank-details-routes.js'
import { config } from '../config/index.js'

// Allow list rather than "not prod" so the unauthenticated diagnostic routes never
// reach internet-facing environments such as ext-test
const DIAGNOSTIC_ENVIRONMENTS = ['local', 'dev', 'test']

const nonProductionRoutes =
  DIAGNOSTIC_ENVIRONMENTS.includes(config.get('server.cdpEnvironment')) ? bankDetailsRoutes : []

export const routes = [
  health,
  ...authRoutes,
  ...homeRoutes,
  ...errors,
  signedOut,
  ...staticAssetRoutes,
  ...footerRoutes,
  ...businessRoutes,
  ...personalRoutes,
  ...nonProductionRoutes,
  catchAllNotFound // This should always be the last route to ensure it only catches unmatched routes
]
