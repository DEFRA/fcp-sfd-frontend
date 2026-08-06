import { Metrics } from '@defra/cdp-metrics'

import { createLogger } from './logger.js'

/**
 * Shared metrics instance for code that runs outside a Hapi request context,
 * such as the DAL token service.
 *
 * Request-scoped code should prefer `request.metrics` or `server.metrics`,
 * which the cdp-metrics plugin decorates onto the server.
 */
export const metrics = new Metrics(createLogger())
