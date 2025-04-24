import convict from 'convict'
import { serverConfig } from './server.js'
import { nunjucksConfig } from './nunjucks.js'
import { redisConfig } from './redis.js'

const config = convict({
  ...serverConfig,
  ...nunjucksConfig,
  ...redisConfig
})

config.validate({ allowed: 'strict' })

export { config }
