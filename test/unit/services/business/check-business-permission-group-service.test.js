// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { checkBusinessPermissionGroupService } from '../../../../src/services/business/check-business-permission-group-service.js'

// Constants
import { FULL_PERMISSIONS, AMEND_PERMISSIONS } from '../../../../src/constants/scope/business-details.js'

describe('checkBusinessPermissionGroupService', () => {
  let permissionLevels

  describe('when the user has full permission', () => {
    beforeEach(() => {
      permissionLevels = [FULL_PERMISSIONS[0]]
    })

    test('it returns fullPermission true and others false', () => {
      const result = checkBusinessPermissionGroupService(permissionLevels)

      expect(result).toEqual({
        fullPermission: true,
        viewPermission: false,
        amendPermission: false
      })
    })
  })

  describe('when the user has both full and amend permission', () => {
    beforeEach(() => {
      permissionLevels = [
        FULL_PERMISSIONS[0],
        AMEND_PERMISSIONS[0]
      ]
    })

    test('it prioritises full permission', () => {
      const result = checkBusinessPermissionGroupService(permissionLevels)

      expect(result).toEqual({
        fullPermission: true,
        viewPermission: false,
        amendPermission: false
      })
    })
  })

  describe('when the user has amend permission only', () => {
    beforeEach(() => {
      permissionLevels = [AMEND_PERMISSIONS[0]]
    })

    test('it returns amendPermission true and others false', () => {
      const result = checkBusinessPermissionGroupService(permissionLevels)

      expect(result).toEqual({
        fullPermission: false,
        viewPermission: false,
        amendPermission: true
      })
    })
  })

  describe('when the user has view permission only', () => {
    beforeEach(() => {
      permissionLevels = ['view']
    })

    test('it returns viewPermission true and others false', () => {
      const result = checkBusinessPermissionGroupService(permissionLevels)

      expect(result).toEqual({
        fullPermission: false,
        amendPermission: false,
        viewPermission: true
      })
    })
  })

  describe('when the user has no recognised permissions', () => {
    beforeEach(() => {
      permissionLevels = []
    })

    test('it defaults to view permission', () => {
      const result = checkBusinessPermissionGroupService(permissionLevels)

      expect(result).toEqual({
        fullPermission: false,
        amendPermission: false,
        viewPermission: true
      })
    })
  })
})
