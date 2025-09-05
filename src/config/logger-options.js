import { ecsFormat } from '@elastic/ecs-pino-format'
import { getTraceId } from '@defra/hapi-tracing'
import { config } from './index.js'

const logConfig = config.get('server.log')
const serviceName = config.get('server.serviceName')
const serviceVersion = config.get('server.serviceVersion')

const QUIET = process.env.QUIET_LOGS === 'true'

const formatters = {
  ecs: {
    ...ecsFormat({ serviceVersion, serviceName })
  },
  'pino-pretty': { transport: { target: 'pino-pretty' } }
}

export const loggerOptions = {
  enabled: logConfig.enabled,
  ignorePaths: QUIET
    ? ['/health', '/public', '/favicon.ico'] // quiet mode ignores static assets
    : ['/health'],
  redact: {
    paths: logConfig.redact,
    remove: true
  },
  level: QUIET ? 'info' : logConfig.level,
  ...formatters[logConfig.format],
  nesting: true,
  mixin: () => {
    const mixinValues = {}
    const traceId = getTraceId()
    if (traceId) {
      mixinValues.trace = { id: traceId }
    }
    return mixinValues
  },
  serializers: QUIET
    ? {
        req: (req) => ({ method: req.method, url: req.url }),
        res: (res) => ({ statusCode: res.statusCode, responseTime: res.responseTime }),
        err: (err) => err
      }
    : undefined,
  logEvents: QUIET ? ['response', 'onPostStart', 'onPostStop'] : ['response', 'onRequest', 'onPostStart', 'onPostStop', 'onPreResponse']
}
