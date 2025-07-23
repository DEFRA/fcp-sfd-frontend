//import { getOldPermissions } from '../auth/get-permissions-old.js'
import { getPermissions } from '../auth/get-permissions.js'
import { getSignOutUrl } from '../auth/get-sign-out-url.js'
import { validateState } from '../auth/state.js'
import { verifyToken } from '../auth/verify-token.js'
import { getSafeRedirect } from '../utils/get-safe-redirect.js'

export const auth = [{
  method: 'GET',
  path: '/auth/sign-in',
  options: {
    auth: 'defra-id'
  },
  handler: function (_request, h) {
    return h.redirect('/home')
  }
}, {
  method: 'GET',
  path: '/auth/sign-in-oidc',
  options: {
    auth: { strategy: 'defra-id', mode: 'try' }
  },
  handler: async function (request, h) {
    // If the user is not authenticated, redirect to the home page
    // This should only occur if the user tries to access the sign-in page directly and not part of the sign-in flow
    // eg if the user has bookmarked the Defra Identity sign-in page or they have signed out and tried to go back in the browser
    if (!request.auth.isAuthenticated) {
      return h.view('unauthorised')
    }

    const { profile, token, refreshToken } = request.auth.credentials
    // verify token returned from Defra Identity against public key
    await verifyToken(token)

    // Typically permissions for the selected organisation would be available in the `roles` property of the token
    // However, when signing in with RPA credentials, the roles only include the role name and not the permissions
    // Therefore, we need to make additional API calls to get the permissions from Siti Agri
    // These calls are authenticated using the token returned from Defra Identity
    // below is hard-coded-value actual data connection is :  const scope = await getPermissions(sbi, profile.crn, profile.email)
     const { privileges } = await getPermissions('107183280', '9477368292', 'not-a-real-email@test.co.uk')
    // Store token and all useful data in the session cache
    await request.server.app.cache.set(profile.sessionId, {
      isAuthenticated: true,
      ...profile,
      scope: privileges,
      token,
      refreshToken
    })

    // Create a new session using cookie authentication strategy which is used for all subsequent requests
    request.cookieAuth.set({ sessionId: profile.sessionId })

    // Redirect user to the page they were trying to access before signing in or to the home page if no redirect was set
    const redirect = request.yar.get('redirect') ?? '/home'
    request.yar.clear('redirect')
    // Ensure redirect is a relative path to prevent redirect attacks
    const safeRedirect = getSafeRedirect(redirect)
    return h.redirect(safeRedirect)
  }
}, {
  method: 'GET',
  path: '/auth/sign-out',
  options: {
    auth: { mode: 'try' }
  },
  handler: async function (request, h) {
    await request.yar.reset()
    if (!request.auth.isAuthenticated) {
      return h.redirect('/')
    }
    const signOutUrl = await getSignOutUrl(request, request.auth.credentials.token)
    return h.redirect(signOutUrl)
  }
}, {
  method: 'GET',
  path: '/auth/sign-out-oidc',
  options: {
    auth: { mode: 'try' }
  },
  handler: async function (request, h) {
    if (request.auth.isAuthenticated) {
      validateState(request, request.query.state)
      if (request.auth.credentials?.sessionId) {
        // Clear the session cache
        await request.server.app.cache.drop(request.auth.credentials.sessionId)

      }
      request.cookieAuth.clear()
    }
    return h.redirect('/')
  }
}, {
  method: 'GET',
  path: '/auth/organisation',
  options: {
    auth: 'defra-id'
  },
  handler: async function (request, h) {
    // Should never be called as the user should no longer be authenticated with `defra-id` after initial sign in
    // The strategy should redirect the user to the sign in page and they will rejoin the service at the /auth/sign-in-oidc route
    // Adding as safeguard
    const redirect = request.yar.get('redirect') ?? '/home'
    request.yar.clear('redirect')
    // Ensure redirect is a relative path to prevent redirect attacks
    const safeRedirect = getSafeRedirect(redirect)
    return h.redirect(safeRedirect)
  }
}]
