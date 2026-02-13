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
 * VAT handling:
 * - VAT does not return a direct link.
 * - Instead, this presenter returns an instruction describing how VAT can
 *   be changed (`normal`, `interrupter`, or `null`).
 * - The businessDetailsPresenter uses this instruction to build the final
 *   VAT display and change links (due to complexity of the VAT display).
 *
 * @module businessDetailsChangeLinksPresenter
 */

import { BUSINESS_CHANGE_LINKS } from '../../constants/change-links.js'
import { config } from '../../config/index.js'

const businessDetailsChangeLinksPresenter = (permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate) => {
  const interrupter = getInterrupterState(hasValidBusinessDetails, sectionsNeedingUpdate)

  if (permissionLevel === 'view') {
    return {
      vat: null
    }
  }

  if (hasBlockedSections(permissionLevel, sectionsNeedingUpdate)) {
    return {
      businessAddress: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
      businessTelephone: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
      businessEmail: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
      vat: null
    }
  }

  const links = {
    businessAddress: resolveChangeLink(interrupter, 'address', BUSINESS_CHANGE_LINKS.businessAddress),
    businessTelephone: resolveChangeLink(interrupter, 'phone', BUSINESS_CHANGE_LINKS.businessTelephone),
    businessEmail: resolveChangeLink(interrupter, 'email', BUSINESS_CHANGE_LINKS.businessEmail),
    vat: resolveVatLink(permissionLevel, interrupter)
  }

  if (permissionLevel === 'full') {
    links.businessName = resolveChangeLink(interrupter, 'businessName', BUSINESS_CHANGE_LINKS.businessName)
  }

  return links
}

/**
 * Determines whether VAT change links should be:
 * - null - user cannot change VAT
 * - 'normal' - direct add/change/remove links
 * - 'interrupter' - forced via business-fix
 */
const resolveVatLink = (permissionLevel, interrupter) => {
  if (permissionLevel !== 'full') {
    return null
  }

  if (!interrupter.active) {
    return 'normal'
  }

  return interrupter.singleSection === 'vat' ? 'normal' : 'interrupter'
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
 * Users with amend permission are blocked if invalid sections include ones
 * they are not allowed to update.
 */
const hasBlockedSections = (permissionLevel, sectionsNeedingUpdate) => {
  if (permissionLevel === 'amend') {
    return sectionsNeedingUpdate.includes('businessName')
  }

  return false
}

/**
 * Determines whether the business details interrupter is active.
 *
 * The business details interrupter is on a feature toggle that forces users to fix
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
