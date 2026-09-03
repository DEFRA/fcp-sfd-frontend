import { isProduction } from '../constants/environments.js'

export const cookieConfig = {
  cookie: {
    name: {
      doc: 'Name of cookies set as part of the cookie policy',
      format: String,
      default: 'fcp_sfd_cookie_policy'
    },
    policy: {
      clearInvalid: {
        doc: 'Clear invalid cookie policy',
        format: Boolean,
        default: true
      },
      encoding: {
        doc: 'Encoding protocol for cookie policy',
        format: String,
        default: 'base64json'
      },
      isSameSite: {
        doc: 'Check if site is the same',
        format: String,
        default: 'Lax'
      },
      isSecure: {
        doc: 'Check if secure',
        format: Boolean,
        default: isProduction
      }
    },
    config: {
      ttl: {
        doc: 'Time to live for cookie policy (ms)',
        format: 'nat',
        default: 1000 * 60 * 60 * 24 * 365
      }
    }
  }
}
