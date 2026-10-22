import { STSClient } from '@aws-sdk/client-sts'

// Decorates server/request with an STS client, used to generate AWS WebIdentity
// tokens for authenticating calls to fcp-sfd-bank-details (see CDP "Service to
// Service Auth" docs).
export const awsSts = {
  plugin: {
    name: 'aws-sts',
    version: '1.0.0',
    register (server) {
      const sts = new STSClient()

      server.decorate('server', 'sts', sts)
      server.decorate('request', 'sts', () => sts, { apply: true })

      server.events.on('stop', () => {
        server.logger.info('Closing AWS STS client')
        sts.destroy()
      })
    }
  }
}
