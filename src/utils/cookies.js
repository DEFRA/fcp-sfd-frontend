import { config } from '../config/index.js'

const cookieNamePolicy = config.get('cookie.name')
const cookiePolicy = config.get('cookie.policy')
const cookieConfig = config.get('cookie.config')

const createDefaultPolicy = () => {
  return { confirmed: false, essential: true, analytics: false }
}

// The policy is stored as plain JSON so Google Tag Manager can read it, so it arrives here as an unparsed string
const parsePolicy = (value) => {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

// request.app takes precedence so the policy just written by POST /cookies is used for the rest of that response
export const getCurrentPolicy = (request) => {
  return request.app?.cookiesPolicy ?? parsePolicy(request.state[cookieNamePolicy]) ?? createDefaultPolicy()
}

export const updatePolicy = (request, h, analytics) => {
  const currentPolicy = getCurrentPolicy(request)

  const cookiesPolicy = {
    ...currentPolicy,
    confirmed: true,
    essential: true,
    analytics: Boolean(analytics)
  }

  h.state(cookieNamePolicy, JSON.stringify(cookiesPolicy), { ...cookiePolicy, ...cookieConfig })

  if (request.app) {
    request.app.cookiesPolicy = cookiesPolicy
  }

  if (!cookiesPolicy.analytics) {
    removeAnalytics(request, h)
  }

  return cookiesPolicy
}

export const removeAnalytics = (request, h) => {
  const googleCookiesRegex = /^_ga$|^_ga_*$|^_gid$|^_ga_.*$|^_gat_.*$/g

  for (const cookieName of Object.keys(request.state)) {
    if (cookieName.search(googleCookiesRegex) === 0) {
      h.unstate(cookieName)
    }
  }
}
