/**
 * Validates that an interrupted journey session is still usable.
 *
 * Ensures the expected session structure exists before allowing
 * the user to continue a fix journey.
 *
 * If the session has been cleared or is incomplete (for example,
 * due to multi-tab usage), the journey should be restarted.
 *
 * @module checkInterruptedJourneySessionService
 */

/**
 * Returns true if the session contains valid data for the given journey.
 * Returns false if the session is missing or incomplete.
 */
const checkInterruptedJourneySessionService = (yar, journeyKey) => {
  const sessionData = yar.get(journeyKey)

  if (!sessionData) {
    return false
  }
  if (Array.isArray(sessionData.orderedSectionsToFix)) {
    return true
  }

  return false
}

export {
  checkInterruptedJourneySessionService
}
