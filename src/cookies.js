import { config } from './config/index.js'

const cookieNamePolicy = config.get('cookie.name')
const cookiePolicy = config.get('cookie.policy')
const cookieConfig = config.get('cookie.config')

const createDefaultPolicy = (h) => {
  const cookiesPolicy = { confirmed: false, essential: true, analytics: false }

  h.state(cookieNamePolicy, cookiesPolicy, { ...cookiePolicy, ...cookieConfig })

  return cookiesPolicy
}

export const getCurrentPolicy = (request, h) => {
  return request.state[cookieNamePolicy] ?? createDefaultPolicy(h)
}

export const updatePolicy = (request, h, analytics) => {
  const cookiesPolicy = getCurrentPolicy(request, h)

  cookiesPolicy.analytics = analytics
  cookiesPolicy.confirmed = true

  h.state(cookieNamePolicy, cookiesPolicy, { ...cookiePolicy, ...cookieConfig })

  if (!analytics) {
    removeAnalytics(request, h)
  }
}

export const removeAnalytics = (request, h) => {
  const googleCookiesRegex = /^_ga$|^_ga_*$|^_gid$|^_ga_.*$|^_gat_.*$/g

  for (const cookieName of Object.keys(request.state)) {
    if (cookieName.search(googleCookiesRegex) === 0) {
      h.unstate(cookieName)
    }
  }
}
