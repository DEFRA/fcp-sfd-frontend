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
import { viewLandRoutes } from './view-land-routes.js'
import { config } from '../config/index.js'

// Allow list rather than "not prod" so the unauthenticated diagnostic routes never
// reach internet-facing environments such as ext-test
const DIAGNOSTIC_ENVIRONMENTS = ['local', 'dev', 'test']

const nonProductionRoutes =
  DIAGNOSTIC_ENVIRONMENTS.includes(config.get('server.cdpEnvironment')) ? bankDetailsRoutes : []

// Not registered when the toggle is off, so the path falls through to the catch-all 404
const toggledViewLandRoutes = config.get('featureToggle.viewLand') ? viewLandRoutes : []

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
  ...toggledViewLandRoutes,
  ...nonProductionRoutes,
  catchAllNotFound // This should always be the last route to ensure it only catches unmatched routes
]
