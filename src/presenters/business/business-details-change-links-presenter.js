/**
 * Business details change links presenter
 *
 * This module generates the "change links" for the business details page based on the
 * user's permission level, the state of the business details, and any sections that
 * need updating.
 *
 * Key points:
 * - Users with "view" permission do not see any change links.
 * - Users with "amend" permission can only update address, phone, and email.
 *   If the invalid data includes sections they cannot update (e.g., name), they are
 *   directed to the RPA/support page.
 * - Users with "full" permission can also update the business name.
 * - The "business details interrupter" can step in when something is invalid,
 *   forcing the user to fix that specific section before they’re allowed to
 *   change anything else.
 *
 * Note: VAT is not included here because its logic is more complex and handled separately
 * in the businessDetailsPresenter due to add/change/remove options.
 *
 * @module businessDetailsChangeLinksPresenter
 */

import { BUSINESS_CHANGE_LINKS } from '../../constants/change-links.js'
import { config } from '../../config/index.js'

const businessDetailsChangeLinksPresenter = (permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate) => {
  const interrupter = getInterrupterState(hasValidBusinessDetails, sectionsNeedingUpdate)

  if (permissionLevel === 'view') {
    return {}
  }

  if (hasBlockedSections(permissionLevel, sectionsNeedingUpdate)) {
    return {
      businessAddress: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
      businessTelephone: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
      businessEmail: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission
    }
  }

  const links = {
    businessAddress: resolveChangeLink(interrupter, 'address', BUSINESS_CHANGE_LINKS.businessAddress),
    businessTelephone: resolveChangeLink(interrupter, 'phone', BUSINESS_CHANGE_LINKS.businessTelephone),
    businessEmail: resolveChangeLink(interrupter, 'email', BUSINESS_CHANGE_LINKS.businessEmail)
  }

  if (permissionLevel === 'full') {
    links.businessName = resolveChangeLink(interrupter, 'name', BUSINESS_CHANGE_LINKS.businessName)
  }

  return links
}

/**
 * Works out which change link to show for a specific business details section.
 *
 * When the business details interrupter is NOT active, this just returns the
 * normal change link for the section.
 *
 * When the interrupter IS active, the user is being forced to fix invalid data:
 * - The one section that needs fixing can link directly to its change page.
 * - All other sections send the user to the business-fix page instead, so they
 *   can’t skip ahead or edit unrelated details.
 */
const resolveChangeLink = (interrupter, section, normalLink) => {
  if (!interrupter.active) {
    return normalLink
  }

  return interrupter.singleSection === section ? normalLink : `/business-fix?source=${section}`
}

/**
 * Checks if the user has blocked sections based on their permission level
 * If a user has a lower permission level of amend and the invalid data is for name (which require full
 * permissions to update) then they are blocked from making any changes
 */
const hasBlockedSections = (permissionLevel, sectionsNeedingUpdate) => {
  if (permissionLevel === 'amend') {
    return sectionsNeedingUpdate.includes('name')
  }

  return false
}

/**
 * The business details interrupter is a feature toggle that forces users to fix
 * invalid business details before they can proceed to change other details.
 *
 * The object returned by this function has two properties:
 * - `active`: a boolean indicating whether the interrupter is enabled and
 *   there are sections that need updating.
 * - `singleSection`: a string indicating the single section that needs updating,
 *   or null if more than one section needs fixing, or the interrupter is not active.
 */
const getInterrupterState = (hasValidBusinessDetails, sectionsNeedingUpdate) => {
  const enabled = config.get('featureToggle.businessDetailsInterrupterEnabled')

  return {
    active: enabled && !hasValidBusinessDetails && sectionsNeedingUpdate.length > 0,
    singleSection: sectionsNeedingUpdate.length === 1 ? sectionsNeedingUpdate[0] : null
  }
}

export {
  businessDetailsChangeLinksPresenter
}
