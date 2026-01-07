/**
 * This service is responsible for updating the user's session with
 *
 * - The ordered list of personal detail sections the user must review/fix
 * - The section the user clicked to get to the fix list page (source)
 *
 * If a user clicks a specific section (source), that section is moved to the
 * top of the list so they see it first, followed by any remaining validation
 * errors in display order.
 *
 * @module setPersonalFixListService
 */

const SECTION_ORDER = ['name', 'dob', 'address', 'phone', 'email']

const setPersonalFixListService = (yar, sessionId, source) => {
  const sessionData = yar.get(sessionId)

  delete sessionData.personalFixList // Clear any existing personal data that has been stored on the session
  sessionData.orderedSections = orderDataItemsToFix(sessionData.validationErrors, source)

  if (source !== undefined) {
    // Source is only set from the personal details page. If its undefined it
    // means its come from elsewhere so we don't set it
    sessionData.source = source
  }

  yar.set(sessionId, sessionData)

  return sessionData
}

/**
 * Returns an ordered list of sections that the user needs to review or fix.
 *
 * Sections are ordered based on how the personal details data is presented on the main page
 * First name, then date of birth, address, phone, and email.
 *
 * If a source is provided, that section is moved to the top of the list. Source
 * indicated the link the user clicked to get to the fix list page.
 */
const orderDataItemsToFix = (validationErrors, source) => {
  const sections = SECTION_ORDER.filter((section) => {
    return validationErrors.includes(section)
  })

  if (!source) {
    return sections
  }

  return [
    source,
    ...sections.filter(section => section !== source)
  ]
}

export {
  setPersonalFixListService
}
