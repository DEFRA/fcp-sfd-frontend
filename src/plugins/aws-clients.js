import { STSClient } from '@aws-sdk/client-sts'

// Without these the SDK's Node handler has no request timeout, so a hung STS call
// would never settle and every caller sharing the in-flight request would hang with it
const STS_CONNECTION_TIMEOUT_MS = 2000
const STS_REQUEST_TIMEOUT_MS = 5000

export const awsClients = {
  plugin: {
    name: 'aws-clients',
    register (server) {
      const sts = new STSClient({
        requestHandler: {
          connectionTimeout: STS_CONNECTION_TIMEOUT_MS,
          requestTimeout: STS_REQUEST_TIMEOUT_MS
        }
      })

      server.decorate('server', 'sts', sts)
      server.decorate('request', 'sts', () => sts, { apply: true })

      server.events.on('stop', () => {
        server.logger.info('Closing AWS SDK clients')
        sts.destroy()
      })
    }
  }
}
