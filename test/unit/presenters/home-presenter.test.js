// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { homePresenter } from '../../../src/presenters/home-presenter.js'

// Test helpers
import {
  VIEW_LEVEL_PERMISSION,
  AMEND_LEVEL_PERMISSION,
  MAKE_LEGAL_CHANGES_PERMISSION,
  FULL_PERMISSION
} from '../../../src/constants/scope/business-details.js'

describe('homePresenter', () => {
  let data
  let permissionGroups
  let enrolmentCount
  let isOnWoodlandManagementAllowList

  beforeEach(() => {
    data = {
      userName: 'Alfred Waldron',
      business: {
        sbi: '123456789',
        name: 'Test Farm Ltd',
        organisationId: '5565448'
      }
    }
    permissionGroups = ['BUSINESS_DETAILS:VIEW']
    enrolmentCount = 1
    isOnWoodlandManagementAllowList = false
  })

  describe('when provided with home data and permission groups', () => {
    test('it correctly presents the data', () => {
      const result = homePresenter(data, permissionGroups, enrolmentCount, isOnWoodlandManagementAllowList)

      expect(result).toEqual({
        pageTitle: 'Your business',
        metaDescription: 'Home page for your business\'s schemes and details.',
        userName: 'Alfred Waldron',
        signOutLink: '/auth/sign-out',
        businessName: 'Test Farm Ltd',
        businessDetails: {
          link: '/business-details',
          text: 'View your Business details'
        },
        personalDetails: {
          link: '/personal-details',
          text: 'View and update your personal details'
        },
        sbi: '123456789',
        grants: []
      })
    })
  })

  describe('the "businessDetails" property', () => {
    describe('when the user has only view-level permissions', () => {
      beforeEach(() => {
        permissionGroups = [VIEW_LEVEL_PERMISSION]
      })

      test('it should return text "View business details"', () => {
        const result = homePresenter(data, permissionGroups, enrolmentCount, isOnWoodlandManagementAllowList)

        expect(result.businessDetails).toEqual({
          link: '/business-details',
          text: 'View your Business details'
        })
      })
    })

    describe('when the user has amend or full permissions', () => {
      beforeEach(() => {
        permissionGroups = [AMEND_LEVEL_PERMISSION]
      })

      test('it should return text "View and update your business details"', () => {
        const result = homePresenter(data, permissionGroups, enrolmentCount, isOnWoodlandManagementAllowList)

        expect(result.businessDetails).toEqual({
          link: '/business-details',
          text: 'View and update your business details'
        })
      })
    })
  })

  describe('the "backLink" property for business selection', () => {
    describe('when the user has multiple enrollments', () => {
      beforeEach(() => {
        enrolmentCount = 7
      })

      test('it should return the choose another business link', () => {
        const result = homePresenter(data, permissionGroups, enrolmentCount, isOnWoodlandManagementAllowList)

        expect(result.backLink).toEqual({
          text: 'Choose another business',
          href: '/auth/reselect-business'
        })
      })
    })

    describe('when the user has only one enrollment', () => {
      beforeEach(() => {
        enrolmentCount = 1
      })

      test('it should not return the business selection link', () => {
        const result = homePresenter(data, permissionGroups, enrolmentCount, isOnWoodlandManagementAllowList)

        expect(result.backLink).toBeUndefined()
      })
    })

    describe('when enrolmentCount is zero', () => {
      beforeEach(() => {
        enrolmentCount = 0
      })

      test('it should not return the business selection link', () => {
        const result = homePresenter(data, permissionGroups, enrolmentCount, isOnWoodlandManagementAllowList)

        expect(result.backLink).toBeUndefined()
      })
    })
  })

  describe('the "grants" property', () => {
    describe('when the user is not on the woodland management allow list', () => {
      beforeEach(() => {
        isOnWoodlandManagementAllowList = false
      })

      describe('and the user has make legal changes permission', () => {
        beforeEach(() => {
          permissionGroups = [MAKE_LEGAL_CHANGES_PERMISSION]
        })

        test('it should include the water management grant', () => {
          const result = homePresenter(data, permissionGroups, enrolmentCount, isOnWoodlandManagementAllowList)

          expect(result.grants).toEqual([
            {
              link: 'https://grants-ui.test.cdp-int.defra.cloud/water-management?ssoOrgId=5565448',
              title: 'Water Management',
              status: 'do-not-show'
            }
          ])
        })
      })

      describe('and the user has full permission', () => {
        beforeEach(() => {
          permissionGroups = [FULL_PERMISSION]
        })

        test('it should include the water management grant', () => {
          const result = homePresenter(data, permissionGroups, enrolmentCount, isOnWoodlandManagementAllowList)

          expect(result.grants).toEqual([
            {
              link: 'https://grants-ui.test.cdp-int.defra.cloud/water-management?ssoOrgId=5565448',
              title: 'Water Management',
              status: 'do-not-show'
            }
          ])
        })
      })

      describe('and the user only has view permission', () => {
        beforeEach(() => {
          permissionGroups = [VIEW_LEVEL_PERMISSION]
        })

        test('it should not include the water management grant', () => {
          const result = homePresenter(data, permissionGroups, enrolmentCount, isOnWoodlandManagementAllowList)

          expect(result.grants).toEqual([])
        })
      })

      describe('and the user only has amend permission', () => {
        beforeEach(() => {
          permissionGroups = [AMEND_LEVEL_PERMISSION]
        })

        test('it should not include the water management grant', () => {
          const result = homePresenter(data, permissionGroups, enrolmentCount, isOnWoodlandManagementAllowList)

          expect(result.grants).toEqual([])
        })
      })
    })

    describe('when the user is on the woodland management allow list', () => {
      beforeEach(() => {
        isOnWoodlandManagementAllowList = true
      })

      describe('and the user only has view permission', () => {
        beforeEach(() => {
          permissionGroups = [VIEW_LEVEL_PERMISSION]
        })

        test('it should only include woodland management', () => {
          const result = homePresenter(data, permissionGroups, enrolmentCount, isOnWoodlandManagementAllowList)

          expect(result.grants).toEqual([
            {
              link: 'https://grants-ui.test.cdp-int.defra.cloud/woodland?ssoOrgId=5565448',
              title: 'Woodland Management Plan',
              status: 'do-not-show'
            }
          ])
        })
      })

      describe('and the user has full permission', () => {
        beforeEach(() => {
          permissionGroups = [FULL_PERMISSION]
        })

        test('it should list both grants alphabetically by title', () => {
          const result = homePresenter(data, permissionGroups, enrolmentCount, isOnWoodlandManagementAllowList)

          expect(result.grants).toEqual([
            {
              link: 'https://grants-ui.test.cdp-int.defra.cloud/water-management?ssoOrgId=5565448',
              title: 'Water Management',
              status: 'do-not-show'
            },
            {
              link: 'https://grants-ui.test.cdp-int.defra.cloud/woodland?ssoOrgId=5565448',
              title: 'Woodland Management Plan',
              status: 'do-not-show'
            }
          ])
        })
      })
    })
  })
})
