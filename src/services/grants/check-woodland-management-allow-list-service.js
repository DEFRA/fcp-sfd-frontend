/**
 * Decides whether a user is on the Woodland Management allow list.
 *
 * Two sources of truth exist while the Grants API integration is being proven:
 * - the Grants API, which owns the allow lists (used when the feature toggle is on)
 * - the comma separated CRN/SBI environment variables (the existing behaviour)
 *
 * This service isolates that choice so the sign in route does not need to know
 * about it, and so the environment variable path can be deleted cleanly once the
 * Grants API integration is proven.
 *
 * @module checkWoodlandManagementAllowListService
 */

import { config } from '../../config/index.js'
import { WOODLAND_MANAGEMENT_GRANT_CODE } from '../../constants/grants.js'
import { allowListService } from '../allow-list-service.js'
import { getAllowedGrants } from './get-allowed-grants-service.js'

/**
 * Checks whether the given user may access the Woodland Management grant.
 *
 * @param {string|number} sbi - Single Business Identifier of the selected business
 * @param {string|number} crn - Customer Reference Number of the signed in user
 * @returns {Promise<boolean>} True when the user is on the allow list
 */
const checkWoodlandManagementAllowList = async (sbi, crn) => {
  if (!config.get('featureToggle.grantsApiAllowListEnabled')) {
    return allowListService(sbi, crn, 'woodlandManagement')
  }

  const allowedGrantCodes = await getAllowedGrants(sbi, crn)

  return allowedGrantCodes.includes(WOODLAND_MANAGEMENT_GRANT_CODE)
}

export {
  checkWoodlandManagementAllowList
}
