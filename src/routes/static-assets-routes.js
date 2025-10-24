import path from 'node:path'
import { config } from '../config/index.js'

export const staticAssetRoutes = [
  {
    options: {
      auth: false,
      cache: false
    },
    method: 'GET',
    path: '/favicon.ico',
    handler (_request, h) {
      return h.file(path.join(process.cwd(), '.public/assets/images/favicon.ico'))
        .header('Cache-Control', 'no-cache, no-store, must-revalidate')
        .header('Pragma', 'no-cache')
        .header('Expires', '0')
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
        path: path.join(process.cwd(), '.public'),
        redirectToSlash: true
      }
    }
  }
]
