import { ecsFormat } from '@elastic/ecs-pino-format'
import { getTraceId } from '@defra/hapi-tracing'
import { config } from './index.js'
import { maskCrn } from '../utils/mask-crn.js'

const logConfig = config.get('server.log')
const serviceName = config.get('server.serviceName')
const serviceVersion = config.get('server.serviceVersion')
const isLocal = config.get('server.isDevelopment')

const formatters = {
  ecs: {
    ...ecsFormat({
      serviceVersion,
      serviceName
    })
  },
  'pino-pretty': { transport: { target: 'pino-pretty' } }
}

export const loggerOptions = {
  enabled: logConfig.enabled,
  ignorePaths: isLocal ? ['/health', '/public', '/favicon.ico'] : ['/health'],
  redact: {
    paths: logConfig.redact,
    remove: true
  },
  level: logConfig.level,
  // Local development logger settings
  ...(isLocal && {
    serializers: {
      req: req => ({
        method: req.method,
        url: req.url
      }),
      res: res => ({
        statusCode: res.statusCode
      })
    }
  }),
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
  getChildBindings: (request) => {
    const bindings = { req: request }
    const credentials = request.auth?.credentials
    if (!credentials) { return bindings }
    // Map to existing ECS schema fields for OpenSearch queryability:
    // - crn → event.reference (enables: SELECT DISTINCT event.reference = unique users)
    // - sbi → event.category (enables: GROUP BY event.category = requests per business)
    // - session_id → event.type (enables: GROUP BY event.type = requests per session)
    return {
      ...bindings,
      event: {
        reference: `crn-${maskCrn(credentials.crn)}`,
        category: credentials.sbi ? `sbi-${credentials.sbi}` : undefined,
        type: credentials.sessionId ? `session_id-${credentials.sessionId}` : undefined
      }
    }
  }
}
