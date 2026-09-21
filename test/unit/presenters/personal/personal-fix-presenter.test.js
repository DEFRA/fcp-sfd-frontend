// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalFixPresenter } from '../../../../src/presenters/personal/personal-fix-presenter.js'

describe('personalFixPresenter', () => {
  let data

  describe('when provided with personal fix data', () => {
    beforeEach(() => {
      data = {
        source: 'name',
        orderedSectionsToFix: ['name'],
        userName: 'Jane Doe'
      }
    })

    test('it correctly presents the data', () => {
      const result = personalFixPresenter(data)

      expect(result).toEqual({
        userName: 'Jane Doe',
        backLink: { href: '/personal-details' },
        pageTitle: 'Update your personal details',
        metaDescription: 'Update your personal details.',
        updateText: 'We will ask you to update these details as well as your full name:',
        listOfErrors: []
      })
    })
  })

  describe('the "updateText" property', () => {
    describe('when two sections need fixing', () => {
      beforeEach(() => {
        data = {
          source: 'name',
          orderedSectionsToFix: ['name', 'email'],
          userName: 'Jane Doe'
        }
      })

      test('it returns a combined update message', () => {
        const result = personalFixPresenter(data)

        expect(result.updateText)
          .toEqual('We will ask you to update your personal email address as well as your full name.')
      })
    })

    describe('when more than two sections need fixing and a source is provided', () => {
      beforeEach(() => {
        data = {
          source: 'address',
          orderedSectionsToFix: ['address', 'dob', 'email'],
          userName: 'Jane Doe'
        }
      })

      test('it references the source section in the update text', () => {
        const result = personalFixPresenter(data)

        expect(result.updateText)
          .toEqual('We will ask you to update these details as well as your personal address:')
      })
    })

    describe('when no source is provided', () => {
      beforeEach(() => {
        data = {
          orderedSectionsToFix: ['name', 'dob', 'email'],
          userName: 'Jane Doe'
        }
      })

      test('it returns a generic update message', () => {
        const result = personalFixPresenter(data)

        expect(result.updateText)
          .toEqual('We will ask you to update these details.')
      })
    })
  })

  describe('the "listOfErrors" property', () => {
    describe('when two sections need fixing', () => {
      beforeEach(() => {
        data = {
          source: 'name',
          orderedSectionsToFix: ['name', 'email'],
          userName: 'Jane Doe'
        }
      })

      test('it returns an empty list', () => {
        const result = personalFixPresenter(data)

        expect(result.listOfErrors).toEqual([])
      })
    })

    describe('when more than two sections need fixing', () => {
      beforeEach(() => {
        data = {
          source: 'phone',
          orderedSectionsToFix: ['email', 'phone', 'name', 'dob'],
          userName: 'Jane Doe'
        }
      })

      test('it returns an ordered list excluding the source', () => {
        const result = personalFixPresenter(data)

        expect(result.listOfErrors).toEqual([
          'full name',
          'date of birth',
          'personal email address'
        ])
      })
    })
  })
})
