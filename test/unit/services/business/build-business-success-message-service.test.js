// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { buildBusinessSuccessMessage } from '../../../../src/services/business/build-business-success-message-service.js'

describe('buildBusinessSuccessMessage', () => {
  let businessDetails

  beforeEach(() => {
    businessDetails = {}
  })

  describe('when only one business detail has changed', () => {
    test('returns a text message for name change', () => {
      businessDetails.changeBusinessName = { businessName: 'Test Business Ltd' }

      const result = buildBusinessSuccessMessage(businessDetails)

      expect(result).toEqual({
        type: 'text',
        value: 'You have updated your business name'
      })
    })

    test('returns a text message for email change', () => {
      businessDetails.changeBusinessEmail = { businessEmail: 'info@test.com' }

      const result = buildBusinessSuccessMessage(businessDetails)

      expect(result).toEqual({
        type: 'text',
        value: 'You have updated your business email address'
      })
    })

    test('returns a text message for phone numbers change', () => {
      businessDetails.changeBusinessPhoneNumbers = {
        businessTelephone: '0123456789',
        businessMobile: '07123456789'
      }

      const result = buildBusinessSuccessMessage(businessDetails)

      expect(result).toEqual({
        type: 'text',
        value: 'You have updated your business phone numbers'
      })
    })

    test('returns a text message for VAT number change', () => {
      businessDetails.changeBusinessVat = { vatNumber: 'GB123456789' }

      const result = buildBusinessSuccessMessage(businessDetails)

      expect(result).toEqual({
        type: 'text',
        value: 'You have updated your business vat number'
      })
    })

    test('returns a text message for address change', () => {
      businessDetails.changeBusinessAddress = { postcode: 'AB12 3CD' }

      const result = buildBusinessSuccessMessage(businessDetails)

      expect(result).toEqual({
        type: 'text',
        value: 'You have updated your business address'
      })
    })
  })

  describe('when multiple business details have changed', () => {
    beforeEach(() => {
      businessDetails.changeBusinessEmail = { businessEmail: 'info@test.com' }
      businessDetails.changeBusinessPhoneNumbers = { businessTelephone: '0123456789' }
      businessDetails.changeBusinessAddress = { postcode: 'AB12 3CD' }
    })

    test('returns an html message', () => {
      const result = buildBusinessSuccessMessage(businessDetails)

      expect(result.type).toBe('html')
    })

    test('includes the notification banner heading', () => {
      const result = buildBusinessSuccessMessage(businessDetails)

      expect(result.value).toContain(
        '<h3 class="govuk-notification-banner__heading">'
      )
      expect(result.value).toContain('You have updated your:')
    })

    test('renders a bullet list with all changed fields', () => {
      const result = buildBusinessSuccessMessage(businessDetails)

      expect(result.value).toContain('<ul class="govuk-list govuk-list--bullet">')
      expect(result.value).toContain('<li>business email address</li>')
      expect(result.value).toContain('<li>business phone numbers</li>')
      expect(result.value).toContain('<li>business address</li>')
    })
  })

  describe('when no business details have changed', () => {
    test('returns an html message with an empty list', () => {
      const result = buildBusinessSuccessMessage(businessDetails)

      expect(result.type).toBe('html')
      expect(result.value).toContain('<ul class="govuk-list govuk-list--bullet">')
    })
  })
})
