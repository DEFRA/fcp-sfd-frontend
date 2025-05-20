import convict from 'convict'
import { serverConfig } from './server.js'
import { nunjucksConfig } from './nunjucks.js'
import { redisConfig } from './redis.js'
import { defraIdConfig } from './defra-id.js'

const config = convict({
  ...serverConfig,
  ...nunjucksConfig,
  ...redisConfig,
  ...defraIdConfig
})

config.validate({ allowed: 'strict' })

export { config }
