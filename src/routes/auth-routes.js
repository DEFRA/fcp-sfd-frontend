import Boom from '@hapi/boom'
import { getPermissions } from '../auth/get-permissions.js'
import { getSignOutUrl } from '../auth/get-sign-out-url.js'
import { validateState } from '../auth/state.js'
import { verifyToken } from '../auth/verify-token.js'
import { allowListService } from '../services/allow-list-service.js'

const AUTH_SIGN_IN_PATH = '/auth/sign-in'

const signIn = {
  method: 'GET',
  path: AUTH_SIGN_IN_PATH,
  options: {
    auth: 'defra-id'
  },
  handler: function (_request, h) {
    return h.redirect('/home')
  }
}

const signInOidc = {
  method: 'GET',
  path: '/auth/sign-in-oidc',
  options: {
    auth: { strategy: 'defra-id', mode: 'try' }
  },
  handler: async function (request, h) {
    const { auth, logger, server, yar, cookieAuth, metrics } = request

    // If the user is not authenticated, redirect to the unauthorised page
    // This should only occur if the user tries to access the sign-in page directly and not part of the sign-in flow
    // eg if the user has bookmarked the Defra Identity sign-in page or they have signed out and tried to go back in the browser
    if (!auth.isAuthenticated) {
      logger.warn(auth.error, 'Defra Identity authentication failed')
      return h.view('unauthorised')
    }
    const { profile, token, refreshToken } = auth.credentials
    // verify token returned from Defra Identity against public key
    await verifyToken(token)

    // Typically permissions for the selected organisation would be available in the `roles` property of the token
    // However, when signing in with RPA credentials, the roles only include the role name and not the permissions
    // Therefore, we need to make additional API calls to get the permissions from Siti Agri
    // These calls are authenticated using the token returned from Defra Identity
    const { sbi, crn, sessionId } = profile
    const { privileges, businessName } = await getPermissions(sbi, crn, token)

    if (!privileges || !businessName) {
      throw Boom.forbidden('Failed to retrieve permissions')
    }

    const isOnWoodlandManagementAllowList = allowListService(sbi, crn, 'woodlandManagement')

    // Store token and all useful data in the session cache
    await server.app.cache.set(sessionId, {
      isAuthenticated: true,
      ...profile,
      sessionId,
      businessName,
      scope: privileges,
      token,
      refreshToken
    })

    // Store lightweight flags like allow list in Yar for easy access
    yar.set('isOnWoodlandManagementAllowList', isOnWoodlandManagementAllowList)

    // Create a new session using cookie authentication strategy which is used for all subsequent requests
    cookieAuth.set({ sessionId })

    logger.info('Defra Identity sign in successful')
    metrics.counter('authSignInSuccess', 1)

    // Redirect to the home route
    return h.redirect('/home')
  }
}

const signOut = {
  method: 'GET',
  path: '/auth/sign-out',
  options: {
    auth: { mode: 'try' }
  },
  handler: async function (request, h) {
    const { auth, server, yar, cookieAuth } = request

    await yar.reset()

    // If not authenticated redirect to home page
    if (!auth.isAuthenticated) {
      return h.redirect('/')
    }

    // Clear the session cache before redirecting to Defra ID to clear SSO session
    // This ensures that the user is signed out of this service even if there is a failure with ending the SSO session
    if (auth.credentials?.sessionId) {
      await server.app.cache.drop(auth.credentials.sessionId)
    }

    // Clear local session cookie
    cookieAuth.clear()

    const signOutUrl = await getSignOutUrl(request, auth.credentials.token)
    return h.redirect(signOutUrl)
  }
}

const signOutOidc = {
  method: 'GET',
  path: '/auth/sign-out-oidc',
  options: {
    auth: { mode: 'try' }
  },
  handler: async function (request, h) {
    const { auth, query, server, cookieAuth } = request

    if (auth.isAuthenticated) {
      // Only reached if the session cookie survived /auth/sign-out; verify state before clearing it
      validateState(request, query.state)

      // Clear session as a fail safe as should already be cleared in /auth/sign-out
      if (auth.credentials?.sessionId) {
        // Clear the session cache
        await server.app.cache.drop(auth.credentials.sessionId)
      }

      // Clear local session cookie as fail safe as should already be cleared in /auth/sign-out
      cookieAuth.clear()
    }

    return h.redirect('/signed-out')
  }
}

const organisation = {
  method: 'GET',
  path: '/auth/organisation',
  options: {
    auth: 'defra-id'
  },
  handler: async function (_request, h) {
    // Should never be called as the user should no longer be authenticated with `defra-id` after initial sign in
    // The strategy should redirect the user to the sign in page and they will rejoin the service at the /auth/sign-in-oidc route
    // Adding as safeguard
    return h.redirect('/home')
  }
}

const reselectBusiness = {
  method: 'GET',
  path: '/auth/reselect-business',
  options: {
    auth: 'defra-id'
  },
  handler: async function (request, h) {
    const { auth } = request

    if (!auth.isAuthenticated) {
      return h.redirect(AUTH_SIGN_IN_PATH)
    }

    // Redirect to Defra Identity with forceReselection parameter to trigger business selection screen
    // The providerParams in the auth plugin will add forceReselection=true for this path
    return h.redirect(AUTH_SIGN_IN_PATH)
  }
}

export const auth = [
  signIn,
  signInOidc,
  signOut,
  signOutOidc,
  organisation,
  reselectBusiness
]
