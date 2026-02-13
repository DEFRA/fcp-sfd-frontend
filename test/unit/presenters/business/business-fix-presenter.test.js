// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessFixPresenter } from '../../../../src/presenters/business/business-fix-presenter.js'

describe('businessFixPresenter', () => {
  let sessionData
  let businessDetails

  describe('when provided with business fix data', () => {
    beforeEach(() => {
      sessionData = {
        source: 'businessName',
        orderedSectionsToFix: ['businessName']
      }

      businessDetails = {
        info: {
          sbi: '123456789',
          businessName: 'Test Business'
        },
        customer: {
          userName: 'testuser'
        }
      }
    })

    test('it correctly presents the data', () => {
      const result = businessFixPresenter(sessionData, businessDetails)

      expect(result).toEqual({
        businessName: 'Test Business',
        sbi: '123456789',
        userName: 'testuser',
        backLink: { href: '/business-details' },
        pageTitle: 'Update your business details',
        metaDescription: 'Update your business details.',
        updateText: 'We will ask you to update these details as well as your business name:',
        listOfErrors: []
      })
    })
  })

  describe('the "updateText" property', () => {
    describe('when two sections need fixing', () => {
      beforeEach(() => {
        sessionData = {
          source: 'businessName',
          orderedSectionsToFix: ['businessName', 'email']
        }
      })

      test('it returns a combined update message', () => {
        const result = businessFixPresenter(sessionData, businessDetails)

        expect(result.updateText).toEqual('We will ask you to update your business email address as well as your business name.')
      })
    })

    describe('when more than two sections need fixing and a source is provided', () => {
      beforeEach(() => {
        sessionData = {
          source: 'address',
          orderedSectionsToFix: ['address', 'vat', 'email']
        }
      })

      test('it references the source section in the update text', () => {
        const result = businessFixPresenter(sessionData, businessDetails)

        expect(result.updateText).toEqual('We will ask you to update these details as well as your business address:')
      })
    })

    describe('when no source is provided', () => {
      beforeEach(() => {
        sessionData = {
          orderedSectionsToFix: ['businessName', 'vat', 'email']
        }
      })

      test('it returns a generic update message', () => {
        const result = businessFixPresenter(sessionData, businessDetails)

        expect(result.updateText).toEqual('We will ask you to update these details.')
      })
    })
  })

  describe('the "listOfErrors" property', () => {
    describe('when two sections need fixing', () => {
      beforeEach(() => {
        sessionData = {
          source: 'businessName',
          orderedSectionsToFix: ['businessName  ', 'vat']
        }
      })

      test('it returns an empty list', () => {
        const result = businessFixPresenter(sessionData, businessDetails)

        expect(result.listOfErrors).toEqual([])
      })
    })

    describe('when more than two sections need fixing', () => {
      beforeEach(() => {
        sessionData = {
          source: 'phone',
          orderedSectionsToFix: ['email', 'phone', 'businessName', 'vat']
        }
      })

      test('it returns an ordered list excluding the source', () => {
        const result = businessFixPresenter(sessionData, businessDetails)

        expect(result.listOfErrors).toEqual([
          'business name',
          'business email address',
          'business VAT number'
        ])
      })
    })
  })

  describe('the "businessName", "sbi" and "userName" properties', () => {
    describe('when business details are provided', () => {
      beforeEach(() => {
        businessDetails = {
          info: {
            sbi: '123456789',
            businessName: 'Test Business'
          },
          customer: {
            userName: 'testuser'
          }
        }
      })

      test('it returns the corresponding values', () => {
        const result = businessFixPresenter(sessionData, businessDetails)

        expect(result.businessName).toEqual('Test Business')
        expect(result.sbi).toEqual('123456789')
        expect(result.userName).toEqual('testuser')
      })
    })

    describe('when business details are missing', () => {
      beforeEach(() => {
        businessDetails = {}
      })

      test('it returns null values', () => {
        const result = businessFixPresenter(sessionData, businessDetails)

        expect(result.businessName).toBeNull()
        expect(result.sbi).toBeNull()
        expect(result.userName).toBeNull()
      })
    })
  })
})
