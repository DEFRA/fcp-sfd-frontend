import { ecsFormat } from '@elastic/ecs-pino-format'
import { getTraceId } from '@defra/hapi-tracing'
import { config } from './index.js'

const logConfig = config.get('server.log')
const serviceName = config.get('server.serviceName')
const serviceVersion = config.get('server.serviceVersion')
const isLocal = config.get('server.isDevelopment')

/**
 * Service name overlap with fcp-sfd-frontend-internal — known logging/alerting gotcha.
 *
 * This service logs as `fcp-sfd-frontend`, and the internal service logs as
 * `fcp-sfd-frontend-internal`. Because `fcp-sfd-frontend` is a prefix of
 * `fcp-sfd-frontend-internal`, the default OpenSearch dashboard queries and the
 * Grafana alert rules that match on service name will match BOTH services.
 *
 * Consequences:
 * - Internal service logs appear on the external service's OpenSearch dashboard
 *   (and vice versa), making it look like this service produced errors it did not.
 * - Grafana alerts (e.g. 5xx rate) configured for one frontend can be triggered by
 *   traffic on the other. A prod alert naming this service may actually originate
 *   from fcp-sfd-frontend-internal.
 *
 * When triaging an alert or dashboard spike, confirm the originating service by
 * checking the `service.name` field on the log entry, and filter it explicitly
 * (e.g. `service.name: "fcp-sfd-frontend"`) rather than relying on a substring match.
 *
 * This affects any pair of services where one name is a prefix of another, please keep this in mind.
 */
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
  }
}
