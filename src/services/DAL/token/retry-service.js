import { constants } from '@defra/fcp-sfd-frontend-engine'
import { drop } from '../../../utils/caching/drop.js'
import { DAL_TOKEN } from '../../../constants/cache-keys.js'
import { metrics } from '../../../utils/metrics.js'

/**
 * Retries an asynchronous function multiple times if it fails
 *
 * If the function throws a 401 error, the cached DAL token is dropped so that
 * a new token can be fetched on the next attempt
 *
 * Each time it retries, it waits a bit longer before trying again, doubling
 * the wait if exponential is true
 */
const retry = async (fn, cache, retriesLeft = 3, interval = 1000, exponential = true) => {
  try {
    return (await fn())
  } catch (err) {
    metrics.counter('dalTokenFetchError', 1)

    if (err.isBoom && err.output.statusCode === constants.statusCodes.UNAUTHORIZED) {
      await drop(DAL_TOKEN, cache)
    }

    if (retriesLeft > 0) {
      metrics.counter('dalTokenRetry', 1)
      await new Promise(resolve => setTimeout(resolve, interval))
      return retry(fn, cache, retriesLeft - 1, exponential ? interval * 2 : interval, exponential)
    } else {
      throw err
    }
  }
}

export { retry }
