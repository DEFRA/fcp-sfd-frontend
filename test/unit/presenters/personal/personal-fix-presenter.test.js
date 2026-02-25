// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalFixPresenter } from '../../../../src/presenters/personal/personal-fix-presenter.js'

describe('personalFixPresenter', () => {
  let personalDetails

  describe('when provided with personal fix data', () => {
    beforeEach(() => {
      personalDetails = {
        source: 'name',
        orderedSectionsToFix: ['name'],
        info: {
          userName: 'Jane Doe'
        }
      }
    })

    test('it correctly presents the data', () => {
      const result = personalFixPresenter(personalDetails)

      expect(result).toEqual({
        userName: 'Jane Doe',
        backLink: { href: '/personal-details' },
        pageTitle: 'Update your personal details',
        metaDescription: 'Update your personal details.',
        updateText: 'We will ask you to update these details as well as your personal name:',
        listOfErrors: []
      })
    })
  })

  describe('the "updateText" property', () => {
    describe('when two sections need fixing', () => {
      beforeEach(() => {
        personalDetails = {
          source: 'name',
          orderedSectionsToFix: ['name', 'email'],
          info: {
            userName: 'Jane Doe'
          }
        }
      })

      test('it returns a combined update message', () => {
        const result = personalFixPresenter(personalDetails)

        expect(result.updateText)
          .toEqual('We will ask you to update your personal email address as well as your personal name.')
      })
    })

    describe('when more than two sections need fixing and a source is provided', () => {
      beforeEach(() => {
        personalDetails = {
          source: 'address',
          orderedSectionsToFix: ['address', 'dob', 'email'],
          info: {
            userName: 'Jane Doe'
          }
        }
      })

      test('it references the source section in the update text', () => {
        const result = personalFixPresenter(personalDetails)

        expect(result.updateText)
          .toEqual('We will ask you to update these details as well as your personal address:')
      })
    })

    describe('when no source is provided', () => {
      beforeEach(() => {
        personalDetails = {
          orderedSectionsToFix: ['name', 'dob', 'email'],
          info: {
            userName: 'Jane Doe'
          }
        }
      })

      test('it returns a generic update message', () => {
        const result = personalFixPresenter(personalDetails)

        expect(result.updateText)
          .toEqual('We will ask you to update these details.')
      })
    })
  })

  describe('the "listOfErrors" property', () => {
    describe('when two sections need fixing', () => {
      beforeEach(() => {
        personalDetails = {
          source: 'name',
          orderedSectionsToFix: ['name', 'email'],
          info: {
            userName: 'Jane Doe'
          }
        }
      })

      test('it returns an empty list', () => {
        const result = personalFixPresenter(personalDetails)

        expect(result.listOfErrors).toEqual([])
      })
    })

    describe('when more than two sections need fixing', () => {
      beforeEach(() => {
        personalDetails = {
          source: 'phone',
          orderedSectionsToFix: ['email', 'phone', 'name', 'dob'],
          info: {
            userName: 'Jane Doe'
          }
        }
      })

      test('it returns an ordered list excluding the source', () => {
        const result = personalFixPresenter(personalDetails)

        expect(result.listOfErrors).toEqual([
          'personal name',
          'personal date of birth',
          'personal email address'
        ])
      })
    })
  })
})
