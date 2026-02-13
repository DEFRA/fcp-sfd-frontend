/**
 * Initialises the fix journey in the user's session.
 *
 * This service is the single place where the fix journey order is defined.
 * It calculates and stores the ordered list of either personal or business
 * detail sections that the user needs to fix.
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
 * @module initialiseFixJourneyService
 */

import { PERSONAL_SECTION_ORDER, BUSINESS_SECTION_ORDER } from '../constants/interrupter-journey.js'

const initialiseFixJourneyService = (yar, source, journeyType) => {
  // Determined by journeyType
  let sessionKey
  let sectionOrder = []

  if (journeyType === 'business') {
    sessionKey = 'businessDetailsValidation'
    sectionOrder = BUSINESS_SECTION_ORDER
  }

  if (journeyType === 'personal') {
    sessionKey = 'personalDetailsValidation'
    sectionOrder = PERSONAL_SECTION_ORDER
  }

  const sessionData = yar.get(sessionKey)

  if (!sessionData?.sectionsNeedingUpdate) {
    return sessionData
  }

  const orderedSectionsToFix = orderSectionsToFix(sessionData.sectionsNeedingUpdate, source, sectionOrder)

  updateSessionData(sessionData, source, orderedSectionsToFix)

  yar.set(sessionKey, sessionData)

  return sessionData
}

const updateSessionData = (sessionData, source, orderedSectionsToFix) => {
  sessionData.orderedSectionsToFix = orderedSectionsToFix

  delete sessionData.sectionsNeedingUpdate
  delete sessionData.personalFixUpdates
  delete sessionData.businessFixUpdates

  if (source) {
    sessionData.source = source
  }
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
const orderSectionsToFix = (sectionsNeedingUpdate, source, SECTION_ORDER) => {
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
  initialiseFixJourneyService
}
