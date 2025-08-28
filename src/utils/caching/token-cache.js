import { config } from '../../config/index.js'

let tokenCache = null

export const initTokenCache = (server, cacheName) => {
  console.log('creating token cache')
  console.log(cacheName)
  console.log(config.get('server.session.cache.tokenSegment'))
  console.log(config.get('redis.ttl'))

  tokenCache = server.cache({
    cache: cacheName,
    segment: config.get('server.session.cache.tokenSegment'),
    expiresIn: config.get('redis.ttl')
  })
  return tokenCache
}

export const getTokenCache = () => {
  if (!tokenCache) {
    throw new Error('Token cache is not initialized.')
  }
  return tokenCache
}
