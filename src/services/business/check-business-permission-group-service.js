/**
 * Resolves a user's business permissions into a single permission group.
 *
 * Given a list of permission scopes, this service determines whether the
 * user has legal, amend, or view-only access to business details.
 *
 * Make legal changes (or full) permission takes priority, followed by amend permission.
 * If neither is present, view permission is assumed.
 *
 * @module checkBusinessPermissionGroupService
 */

import { LEGAL_PERMISSIONS, AMEND_PERMISSIONS } from '../../constants/scope/business-details.js'

const checkBusinessPermissionGroupService = (permissionLevels) => {
  const legalPermission = permissionLevels.some(permission => LEGAL_PERMISSIONS.includes(permission))
  if (legalPermission) {
    return 'legal'
  }

  const amendPermission = permissionLevels.some(permission => AMEND_PERMISSIONS.includes(permission))
  if (amendPermission) {
    return 'amend'
  }

  return 'view'
}

export {
  checkBusinessPermissionGroupService
}
