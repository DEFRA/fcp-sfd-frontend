// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { homePresenter } from '../../../src/presenters/home-presenter.js'

// Test helpers
import { VIEW_LEVEL_PERMISSION, AMEND_LEVEL_PERMISSION } from '../../../src/constants/scope/business-details.js'

describe('homePresenter', () => {
  let data
  let permissionGroups

  beforeEach(() => {
    data = {
      business: {
        info: {
          sbi: '123456789',
          userName: 'Alfred Waldron',
          name: 'Test Farm Ltd',
          organisationId: '5565448'
        }
      }
    }
    permissionGroups = ['BUSINESS_DETAILS:VIEW']
  })

  describe('when provided with home data and permission groups', () => {
    test('it correctly presents the data', () => {
      const result = homePresenter(data, permissionGroups)

      expect(result).toEqual({
        pageTitle: 'Your business',
        metaDescription: 'Home page for your business\'s schemes and details.',
        userName: 'Alfred Waldron',
        businessName: 'Test Farm Ltd',
        businessDetails: {
          link: '/business-details',
          text: 'View your Business details'
        },
        sbi: '123456789',
        iahwLink: 'https://ffc-ahwr-farmer-test.azure.defra.cloud/sign-in?ssoOrgId=5565448'
      })
    })
  })

  describe('the "userName" property', () => {
    test('returns the userName from business info', () => {
      const result = homePresenter(data, permissionGroups)

      expect(result.userName).toEqual('Alfred Waldron')
    })
  })

  describe('the "businessDetails" property', () => {
    describe('when the user has only view-level permissions', () => {
      beforeEach(() => {
        permissionGroups = [VIEW_LEVEL_PERMISSION]
      })

      test('it should return text "View business details"', () => {
        const result = homePresenter(data, permissionGroups)

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
        const result = homePresenter(data, permissionGroups)

        expect(result.businessDetails).toEqual({
          link: '/business-details',
          text: 'View and update your business details'
        })
      })
    })
  })
})
