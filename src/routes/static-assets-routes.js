import path from 'node:path'
import { config } from '../config/index.js'

export const staticAssetRoutes = [
  {
    options: {
      auth: false,
      cache: {
        expiresIn: 31536000,
        privacy: 'public'
      }
    },
    method: 'GET',
    path: '/favicon.ico',
    handler (_request, h) {
      return h.file(path.join(process.cwd(), '.public/assets/images/favicon.ico'))
    }
  },
  {
    options: {
      auth: false,
      cache: {
        expiresIn: config.get('server.staticCacheTimeout'),
        privacy: 'private'
      }
    },
    method: 'GET',
    path: `${config.get('server.assetPath')}/{param*}`,
    handler: {
      directory: {
        path: [
          path.join(process.cwd(), '.public'),
          path.join(process.cwd(), 'node_modules/govuk-frontend/dist/govuk/assets')
        ],
        redirectToSlash: true
      }
    }
  }
]
