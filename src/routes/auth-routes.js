import { getPermissions } from '../auth/get-permissions.js'
import { getSignOutUrl } from '../auth/get-sign-out-url.js'
import { validateState } from '../auth/state.js'
import { verifyToken } from '../auth/verify-token.js'
import { getSafeRedirect } from '../utils/get-safe-redirect.js'
import { createLogger } from '../utils/logger.js'

const logger = createLogger()

const signIn = {
  method: 'GET',
  path: '/auth/sign-in',
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
    // If the user is not authenticated, redirect to the home page
    // This should only occur if the user tries to access the sign-in page directly and not part of the sign-in flow
    // eg if the user has bookmarked the Defra Identity sign-in page or they have signed out and tried to go back in the browser
    if (!request.auth.isAuthenticated) {
      logger.info('Sign-in OIDC callback: user not authenticated, showing unauthorised view')
      return h.view('unauthorised')
    }

    const { profile, token, refreshToken } = request.auth.credentials

    // verify token returned from Defra Identity against public key
    logger.info('Sign-in OIDC callback: verifying token')
    try {
      await verifyToken(token)
    } catch (error) {
      logger.error(error, 'Sign-in OIDC callback: failed to verify token')
      throw error
    }

    // Typically permissions for the selected organisation would be available in the `roles` property of the token
    // However, when signing in with RPA credentials, the roles only include the role name and not the permissions
    // Therefore, we need to make additional API calls to get the permissions from Siti Agri
    // These calls are authenticated using the token returned from Defra Identity
    const { sbi, crn, sessionId } = profile

    logger.info({ sbi, crn }, 'Sign-in OIDC callback: fetching permissions')
    let privileges, businessName
    try {
      ({ privileges, businessName } = await getPermissions(sbi, crn))
    } catch (error) {
      logger.error(error, 'Sign-in OIDC callback: failed to fetch permissions')
      throw error
    }
    logger.info({ sbi, crn }, 'Sign-in OIDC callback: permissions fetched')

    // Store token and all useful data in the session cache
    try {
      await request.server.app.cache.set(sessionId, {
        isAuthenticated: true,
        ...profile,
        businessName,
        scope: privileges,
        token,
        refreshToken
      })
    } catch (error) {
      logger.error(error, 'Sign-in OIDC callback: failed to set session cache')
      throw error
    }

    // Create a new session using cookie authentication strategy which is used for all subsequent requests
    request.cookieAuth.set({ sessionId })

    // Redirect user to the page they were trying to access before signing in or to the home page if no redirect was set
    const redirect = request.yar.get('redirect') ?? '/home'
    request.yar.clear('redirect')
    // Ensure redirect is a relative path to prevent redirect attacks
    const safeRedirect = getSafeRedirect(redirect)
    logger.info({ redirect: safeRedirect }, 'Sign-in OIDC callback: sign-in complete, redirecting')
    return h.redirect(safeRedirect)
  }
}

const signOut = {
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
}

const signOutOidc = {
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
    return h.redirect('/signed-out')
  }
}

const organisation = {
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
}

export const auth = [
  signIn,
  signInOidc,
  signOut,
  signOutOidc,
  organisation
]
