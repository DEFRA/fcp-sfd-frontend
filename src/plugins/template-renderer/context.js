import path from 'node:path'
import { readFileSync } from 'node:fs'

import { config } from '../../config/index.js'
import { createLogger } from '../../utils/logger.js'
import { getNavigationItems } from '../../config/navigation-items.js'

const logger = createLogger()
const assetPath = config.get('server.assetPath')
const manifestPath = path.join(
  config.get('server.root'),
  '.public/assets-manifest.json'
)

let webpackManifest

export const context = (request) => {
  if (!webpackManifest) {
    try {
      webpackManifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
    } catch (error) {
      logger.error(`Webpack ${path.basename(manifestPath)} not found`)
    }
  }

  return {
    assetPath: `${assetPath}/assets`,
    serviceName: config.get('server.serviceName'),
    serviceUrl: '/',
    breadcrumbs: [],
    navigation: getNavigationItems(request),

    getAssetPath (asset) {
      const webpackAssetPath = webpackManifest?.[asset]
      const result = `${assetPath}/${webpackAssetPath ?? asset}`
      return result
    }
  }
}
