/**
 * Initialises the personal details fix journey in the user's session.
 *
 * This service is the single place where the fix journey order is defined.
 * It calculates and stores the ordered list of personal detail sections
 * that the user needs to fix.
 *
 * This sets:
 * - orderedSectionsToFix: the ordered list of sections to fix
 * - source: the section the user selected to start the journey (if provided)
 *
 * If a source is provided, that section is placed first, followed by the
 * remaining sections in the order defined by this service.
 *
 * Downstream routes and presenters read this data from the session and
 * don't reorder it.
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
  delete sessionData.personalFixUpdates

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
