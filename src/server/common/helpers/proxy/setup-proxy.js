import { ProxyAgent, setGlobalDispatcher } from 'undici'
import { config } from '../../../../config/index.js'
import { createLogger } from '../../../../utils/logger.js'
const logger = createLogger()

/**
 * If HTTP_PROXY is set setupProxy() will enable it globally
 * for a number of http clients.
 * Node Fetch will still need to pass a ProxyAgent in on each call.
 */
export const setupProxy = () => {
  const proxyUrl = config.get('server.httpProxy')

  if (proxyUrl) {
    logger.info('setting up global proxies')

    setGlobalDispatcher(new ProxyAgent(proxyUrl))
  }
}
