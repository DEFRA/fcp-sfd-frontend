/**
 * Initialises the personal details fix journey in the user's session.
 *
 * This sets:
 * - An ordered list of personal detail sections that need fixing
 * - The section the user selected (source), if provided
 *
 * If a source is provided, that section is shown first, followed by any
 * remaining sections in display order.
 *
 * @module initialisePersonalFixJourneyService
 */

const SECTION_ORDER = ['name', 'dob', 'address', 'phone', 'email']

const initialisePersonalFixJourneyService = (yar, source) => {
  const sessionData = yar.get('personalDetailsValidation')

  if (!sessionData?.sectionsNeedingUpdate) {
    return sessionData
  }

  const orderedSectionsToFix = orderSectionsToFix(sessionData.sectionsNeedingUpdate, source)

  // Replace validation sections with the ordered fix list
  sessionData.orderedSectionsToFix = orderedSectionsToFix
  delete sessionData.sectionsNeedingUpdate

  if (source) {
    // Source is only set when coming from the personal details page
    sessionData.source = source
  }

  yar.set('personalDetailsValidation', sessionData)

  return sessionData
}

/**
 * Returns an ordered list of sections that the user needs to fix.
 *
 * Sections are ordered based on how the personal details data is presented on the main page
 * First name, date of birth, address, phone, and email.
 *
 * If a source is provided, that section is moved to the top of the list. Source
 * indicates which link the user clicked to get to the fix list page.
 */
const orderSectionsToFix = (sectionsNeedingUpdate, source) => {
  const sections = SECTION_ORDER.filter((section) => {
    return sectionsNeedingUpdate.includes(section)
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
  initialisePersonalFixJourneyService
}
