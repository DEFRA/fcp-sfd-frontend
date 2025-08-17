import { config } from'../../config/index.js'

/**
 * A helper function to set cached items
 *
 * This module exports `set` function that sets a specific key in the cache store (e.g Redis). It retrieves
 * the active cache client instance `getCache()` and calls the `set` method to set the key-value pair.
 * The value will automatically expire after the configured ttl (time-to-live)
 */
const set = async (key, value, cache) => {
  await cache.set(key, value, config.get('redisConfig.ttl'))
}

export { set }
