import convict from 'convict'
import { serverConfig } from './server.js'
import { nunjucksConfig } from './nunjucks.js'
import { redisConfig } from './redis.js'
import { defraIdConfig } from './defra-id.js'
import { dalConfig } from './dal.js'
import { featureToggleConfig } from './feature-toggle.js'
import { osPlacesConfig } from './os-places.js'
import { servicesConfig } from './services.js'

const config = convict({
  ...serverConfig,
  ...nunjucksConfig,
  ...redisConfig,
  ...defraIdConfig,
  ...dalConfig,
  ...osPlacesConfig,
  ...featureToggleConfig,
  ...servicesConfig
})

config.validate({ allowed: 'strict' })

export { config }
