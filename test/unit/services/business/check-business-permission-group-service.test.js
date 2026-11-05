// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { checkBusinessPermissionGroupService } from '../../../../src/services/business/check-business-permission-group-service.js'

// Constants
import {
  FULL_PERMISSION,
  MAKE_LEGAL_CHANGES_PERMISSION,
  AMEND_LEVEL_PERMISSION,
  VIEW_LEVEL_PERMISSION,
  PERMISSION_GROUP
} from '../../../../src/constants/scope/business-details.js'

describe('checkBusinessPermissionGroupService', () => {
  let permissionLevels

  describe('when the user has full permission only', () => {
    beforeEach(() => {
      permissionLevels = [FULL_PERMISSION]
    })

    test('it returns "legal"', () => {
      const result = checkBusinessPermissionGroupService(permissionLevels)

      expect(result).toBe(PERMISSION_GROUP.LEGAL)
    })
  })

  describe('when the user has make legal changes permission only', () => {
    beforeEach(() => {
      permissionLevels = [MAKE_LEGAL_CHANGES_PERMISSION]
    })

    test('it returns "legal"', () => {
      const result = checkBusinessPermissionGroupService(permissionLevels)

      expect(result).toBe(PERMISSION_GROUP.LEGAL)
    })
  })

  describe('when the user has amend permission only', () => {
    beforeEach(() => {
      permissionLevels = [AMEND_LEVEL_PERMISSION]
    })

    test('it returns "amend"', () => {
      const result = checkBusinessPermissionGroupService(permissionLevels)

      expect(result).toBe(PERMISSION_GROUP.AMEND)
    })
  })

  describe('when the user has view permission only', () => {
    beforeEach(() => {
      permissionLevels = [VIEW_LEVEL_PERMISSION]
    })

    test('it returns "view"', () => {
      const result = checkBusinessPermissionGroupService(permissionLevels)

      expect(result).toBe(PERMISSION_GROUP.VIEW)
    })
  })

  describe('when the user has no recognised permissions', () => {
    beforeEach(() => {
      permissionLevels = []
    })

    test('it defaults to "view"', () => {
      const result = checkBusinessPermissionGroupService(permissionLevels)

      expect(result).toBe(PERMISSION_GROUP.VIEW)
    })
  })

  describe('when the user has multiple permissions', () => {
    test('it returns "legal" for full and amend permission', () => {
      const result = checkBusinessPermissionGroupService([FULL_PERMISSION, AMEND_LEVEL_PERMISSION])

      expect(result).toBe(PERMISSION_GROUP.LEGAL)
    })

    test('it returns "legal" for make legal changes and amend permission', () => {
      const result = checkBusinessPermissionGroupService([MAKE_LEGAL_CHANGES_PERMISSION, AMEND_LEVEL_PERMISSION])

      expect(result).toBe(PERMISSION_GROUP.LEGAL)
    })
  })
})
