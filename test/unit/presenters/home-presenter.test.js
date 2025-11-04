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
      info: {
        fullName: {
          first: 'Alfred',
          middle: 'M',
          last: 'Waldron'
        }
      },
      business: {
        info: {
          sbi: '123456789',
          name: 'Test Farm Ltd'
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
        fullName: 'Alfred M Waldron',
        businessName: 'Test Farm Ltd',
        businessDetails: {
          link: '/business-details',
          text: 'View your Business details'
        },
        sbi: '123456789'
      })
    })
  })

  describe('the "fullName" property', () => {
    test('returns a formatted full name', () => {
      const result = homePresenter(data, permissionGroups)

      expect(result.fullName).toEqual('Alfred M Waldron')
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
