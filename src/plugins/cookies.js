import { constants } from '@defra/fcp-sfd-frontend-engine'
import { config } from '../config/index.js'
import { getCurrentPolicy, removeAnalytics } from '../utils/cookies.js'

const cookieNamePolicy = config.get('cookie.name')
const cookiePolicy = config.get('cookie.policy')

export const cookies = {
  plugin: {
    name: 'cookies',
    register: (server, _options) => {
      server.state(cookieNamePolicy, cookiePolicy)

      server.ext('onPreResponse', (request, h) => {
        const statusCode = request.response.statusCode

        if (
          request.response.variety === 'view' &&
          statusCode < constants.statusCodes.BAD_REQUEST &&
          request.response.source?.context
        ) {
          const cookiesPolicy = getCurrentPolicy(request, h)

          request.response.source.context.cookiesPolicy = cookiesPolicy

          if ((!cookiesPolicy.analytics)) {
            removeAnalytics(request, h)
          }
        }

        return h.continue
      })
    }
  }
}
