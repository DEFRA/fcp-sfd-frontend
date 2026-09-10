import { isProduction } from '../constants/environments.js'

export const cookieConfig = {
  cookie: {
    name: {
      doc: 'Name of cookies set as part of the cookie policy',
      format: String,
      default: 'cookie_policy'
    },
    policy: {
      encoding: {
        doc: 'Encoding protocol for cookie policy, kept unencoded so the value is readable JSON',
        format: String,
        default: 'none'
      },
      isHttpOnly: {
        doc: 'Hide the cookie policy from client side scripts, which must stay false so Google Tag Manager can read consent',
        format: Boolean,
        default: false
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
      },
      strictHeader: {
        doc: 'Require an RFC 6265 compliant header, which plain JSON is not',
        format: Boolean,
        default: false
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
