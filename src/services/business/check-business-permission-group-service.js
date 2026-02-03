/**
 * Resolves a user's business permissions into a single permission group.
 *
 * Given a list of permission scopes, this service determines whether the
 * user has full, amend, or view-only access to business details.
 *
 * Full permission takes priority, followed by amend permission.
 * If neither is present, view permission is assumed.
 *
 * @module checkBusinessPermissionGroupService
 */

import { FULL_PERMISSIONS, AMEND_PERMISSIONS } from '../../constants/scope/business-details.js'

const checkBusinessPermissionGroupService = (permissionLevels) => {
  const fullPermission = permissionLevels.some(permission => FULL_PERMISSIONS.includes(permission))
  if (fullPermission) {
    return 'full'
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
