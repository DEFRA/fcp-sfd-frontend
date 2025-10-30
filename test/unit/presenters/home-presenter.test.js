// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { homePresenter } from '../../../src/presenters/home-presenter.js'

// Test helpers
import { VIEW_LEVEL_PERMISSION, AMEND_LEVEL_PERMISSION } from '../../../src/constants/scope/business-details.js'

describe('homePresenter', () => {
  let authData

  beforeEach(() => {
    authData = {
      name: 'Alfred Waldron',
      credentials: {
        scope: ['BUSINESS_DETAILS:VIEW']
      }
    }
  })

  describe('when provided with auth data', () => {
    test('it correctly presents the data', () => {
      const result = homePresenter(authData)

      expect(result).toEqual({
        userName: 'Alfred Waldron',
        businessDetails: {
          link: '/business-details',
          text: 'View business details'
        }
      })
    })
  })

  describe('the "userName" property', () => {
    describe('when the name property is missing', () => {
      beforeEach(() => {
        delete authData.name
      })

      test('it should return userName as null', () => {
        const result = homePresenter(authData)

        expect(result.userName).to.equal(null)
      })
    })
  })

  describe('the "businessDetails" property', () => {
    describe('when the user has only view-level permissions', () => {
      beforeEach(() => {
        authData.credentials.scope = [VIEW_LEVEL_PERMISSION]
      })

      test('it should return text "View business details"', () => {
        const result = homePresenter(authData)

        expect(result.businessDetails).toEqual({
          link: '/business-details',
          text: 'View business details'
        })
      })
    })

    describe('when the user has amend or full permissions', () => {
      beforeEach(() => {
        authData.credentials.scope = [AMEND_LEVEL_PERMISSION]
      })

      test('it should return text "View and update your business details"', () => {
        const result = homePresenter(authData)

        expect(result.businessDetails).toEqual({
          link: '/business-details',
          text: 'View and update your business details'
        })
      })
    })
  })
})
