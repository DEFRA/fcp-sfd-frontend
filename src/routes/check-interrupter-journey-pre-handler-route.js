/**
 * Creates a Hapi pre-handler that:
 * - checks the interrupted journey session
 * - redirects to the given path if the session is invalid
 *
 * Used to guard interrupted journey routes.
 *
 * @module checkInterruptedJourneyPreHandler
 */

import { checkInterruptedJourneySessionService } from '../services/check-interrupter-journey-session-service.js'

const checkInterruptedJourneyPreHandler = (journeyKey, redirectPath) => ({
  method: (request, h) => {
    const { yar } = request

    const isValid = checkInterruptedJourneySessionService(yar, journeyKey)

    if (!isValid) {
      return h.redirect(redirectPath).takeover()
    }

    return true
  }
})

export {
  checkInterruptedJourneyPreHandler
}
