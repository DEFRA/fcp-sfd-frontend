import { errors } from './errors/index.js'
import { health } from './health.js'
import { home } from './home.js'
import { staticAssetRoutes } from './static-assets.js'

export const routes = [
  health,
  home,
  ...errors,
  ...staticAssetRoutes
]
