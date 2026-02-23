// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { buildPersonalSuccessMessage } from '../../../../src/services/personal/build-personal-success-message-service.js'

describe('buildPersonalSuccessMessage', () => {
  let personalDetails

  beforeEach(() => {
    personalDetails = {
      orderedSectionsToFix: []
    }
  })

  describe('when only one personal detail has changed', () => {
    test('returns a text message for name change', () => {
      personalDetails.orderedSectionsToFix = ['name']
      personalDetails.changePersonalName = { first: 'John', last: 'Doe' }
      const result = buildPersonalSuccessMessage(personalDetails)

      expect(result).toEqual({
        type: 'text',
        value: 'You have updated your full name'
      })
    })

    test('returns a text message for email change', () => {
      personalDetails.orderedSectionsToFix = ['email']
      personalDetails.changePersonalEmail = { personalEmail: 'test@email.com' }

      const result = buildPersonalSuccessMessage(personalDetails)

      expect(result).toEqual({
        type: 'text',
        value: 'You have updated your personal email address'
      })
    })

    test('returns a text message for date of birth change', () => {
      personalDetails.orderedSectionsToFix = ['dob']
      personalDetails.changePersonalDob = { day: '01', month: '01', year: '2000' }

      const result = buildPersonalSuccessMessage(personalDetails)

      expect(result).toEqual({
        type: 'text',
        value: 'You have updated your date of birth'
      })
    })

    test('returns a text message for address change', () => {
      personalDetails.orderedSectionsToFix = ['address']
      personalDetails.changePersonalAddress = { postcode: 'AB12 3CD' }

      const result = buildPersonalSuccessMessage(personalDetails)

      expect(result).toEqual({
        type: 'text',
        value: 'You have updated your personal address'
      })
    })
  })

  describe('when multiple personal details have changed', () => {
    beforeEach(() => {
      personalDetails.orderedSectionsToFix = ['email', 'address', 'phone']

      personalDetails.changePersonalEmail = { personalEmail: 'test@email.com' }
      personalDetails.changePersonalPhoneNumbers = { personalPhoneNumbers: '0123456789' }
      personalDetails.changePersonalAddress = { postcode: 'AB12 3CD' }
    })

    test('returns an html message', () => {
      const result = buildPersonalSuccessMessage(personalDetails)

      expect(result.type).toBe('html')
    })

    test('includes the notification banner heading', () => {
      const result = buildPersonalSuccessMessage(personalDetails)

      expect(result.value).toContain(
        '<h3 class="govuk-notification-banner__heading">'
      )
      expect(result.value).toContain('You have updated your:')
    })

    test('renders a bullet list with all changed fields in the ordered list', () => {
      const result = buildPersonalSuccessMessage(personalDetails)

      expect(result.value).toContain('<ul class="govuk-list govuk-list--bullet">')
      expect(result.value).toContain('<li>personal email address</li>')
      expect(result.value).toContain('<li>personal phone numbers</li>')
      expect(result.value).toContain('<li>personal address</li>')
      expect(result.value).toContain('<li>personal email address</li><li>personal address</li><li>personal phone numbers</li>')
    })
  })

  describe('when no personal details have changed', () => {
    test('returns an html message with an empty list', () => {
      const result = buildPersonalSuccessMessage(personalDetails)

      expect(result.type).toBe('html')
      expect(result.value).toContain('<ul class="govuk-list govuk-list--bullet">')
    })
  })
})
