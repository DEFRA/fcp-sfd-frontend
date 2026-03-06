// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { homePresenter } from '../../../src/presenters/home-presenter.js'

// Test helpers
import { VIEW_LEVEL_PERMISSION, AMEND_LEVEL_PERMISSION } from '../../../src/constants/scope/business-details.js'

describe('homePresenter', () => {
  let data
  let permissionGroups
  let enrolmentCount

  beforeEach(() => {
    data = {
      info: {
        userName: 'Alfred Waldron'
      },
      business: {
        info: {
          sbi: '123456789',
          name: 'Test Farm Ltd',
          organisationId: '5565448'
        }
      }
    }
    permissionGroups = ['BUSINESS_DETAILS:VIEW']
    enrolmentCount = 1
  })

  describe('when provided with home data and permission groups', () => {
    test('it correctly presents the data', () => {
      const result = homePresenter(data, permissionGroups, enrolmentCount)

      expect(result).toEqual({
        pageTitle: 'Your business',
        metaDescription: 'Home page for your business\'s schemes and details.',
        userName: 'Alfred Waldron',
        businessName: 'Test Farm Ltd',
        businessDetails: {
          link: '/business-details',
          text: 'View your Business details'
        },
        sbi: '123456789'
      })
    })
  })

  describe('the "businessDetails" property', () => {
    describe('when the user has only view-level permissions', () => {
      beforeEach(() => {
        permissionGroups = [VIEW_LEVEL_PERMISSION]
      })

      test('it should return text "View business details"', () => {
        const result = homePresenter(data, permissionGroups, enrolmentCount)

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
        const result = homePresenter(data, permissionGroups, enrolmentCount)

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
        const result = homePresenter(data, permissionGroups, enrolmentCount)

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
        const result = homePresenter(data, permissionGroups, enrolmentCount)

        expect(result.backLink).toBeUndefined()
      })
    })

    describe('when enrolmentCount is zero', () => {
      beforeEach(() => {
        enrolmentCount = 0
      })

      test('it should not return the business selection link', () => {
        const result = homePresenter(data, permissionGroups, enrolmentCount)

        expect(result.backLink).toBeUndefined()
      })
    })
  })
})
