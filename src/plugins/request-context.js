import { maskCrn } from '../utils/mask-crn.js'

export const requestContext = {
  plugin: {
    name: 'request-context',
    register: (server) => {
      server.ext('onPreResponse', (request, h) => {
        if (typeof request.logger?.child !== 'function') {
          return h.continue
        }

        const credentials = request.auth?.credentials
        request.logger = request.logger.child({
          event: {
            reference: credentials?.crn ? `crn-${maskCrn(credentials.crn)}` : '',
            category: credentials?.sbi ? `sbi-${credentials.sbi}` : '',
            type: credentials?.sessionId ? `session_id-${credentials.sessionId}` : ''
          }
        })
        return h.continue
      })
    }
  }
}
