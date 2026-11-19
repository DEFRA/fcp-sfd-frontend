// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Mocks
import { config } from '../../../../src/config/index.js'

// Thing under test
import {
  isPersonalFieldAccessible,
  isBusinessFieldAccessible,
  getDisabledFieldMessage,
  getDisabledFieldNotification,
  PERSONAL_FIELDS,
  BUSINESS_FIELDS
} from '../../../../src/utils/feature-toggle/check-field-accessibility.js'

vi.mock('../../../../src/config/index.js', () => ({
  config: {
    get: vi.fn()
  }
}))

describe('checkFieldAccessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('PERSONAL_FIELDS', () => {
    test('contains all personal field mappings', () => {
      expect(PERSONAL_FIELDS).toEqual({
        name: 'updatePersonalDetailsName',
        dob: 'updatePersonalDetailsDob',
        address: 'updatePersonalDetailsAddress',
        phone: 'updatePersonalDetailsPhone',
        email: 'updatePersonalDetailsEmail'
      })
    })
  })

  describe('BUSINESS_FIELDS', () => {
    test('contains all business field mappings', () => {
      expect(BUSINESS_FIELDS).toEqual({
        name: 'updateBusinessDetailsName',
        address: 'updateBusinessDetailsAddress',
        phone: 'updateBusinessDetailsPhone',
        email: 'updateBusinessDetailsEmail',
        vat: 'updateBusinessDetailsVat',
        registrationNumber: 'updateBusinessDetailsRegistrationNumber'
      })
    })
  })

  describe('isPersonalFieldAccessible', () => {
    describe('when the master toggle is disabled', () => {
      beforeEach(() => {
        config.get.mockImplementation((key) => {
          if (key === 'featureToggle.personalDetails.updatePersonalDetails') {
            return false
          }
          return true
        })
      })

      test('returns false for all fields regardless of field-level toggle', () => {
        expect(isPersonalFieldAccessible('name')).toBe(false)
        expect(isPersonalFieldAccessible('dob')).toBe(false)
        expect(isPersonalFieldAccessible('address')).toBe(false)
        expect(isPersonalFieldAccessible('phone')).toBe(false)
        expect(isPersonalFieldAccessible('email')).toBe(false)
      })
    })

    describe('when the master toggle is enabled', () => {
      beforeEach(() => {
        config.get.mockReturnValue(true)
      })

      test('returns true when field-level toggle is enabled', () => {
        expect(isPersonalFieldAccessible('name')).toBe(true)
      })

      test('returns false when field-level toggle is disabled', () => {
        config.get.mockImplementation((key) => {
          if (key === 'featureToggle.personalDetails.updatePersonalDetailsName') {
            return false
          }
          return true
        })

        expect(isPersonalFieldAccessible('name')).toBe(false)
      })

      test('supports all personal field types', () => {
        Object.keys(PERSONAL_FIELDS).forEach((field) => {
          expect(() => isPersonalFieldAccessible(field)).not.toThrow()
        })
      })
    })

    describe('with invalid field names', () => {
      beforeEach(() => {
        config.get.mockReturnValue(true)
      })

      test('throws an error for unknown personal fields', () => {
        expect(() => isPersonalFieldAccessible('invalidField')).toThrow('Unknown personal field: invalidField')
      })
    })
  })

  describe('isBusinessFieldAccessible', () => {
    describe('when the master toggle is disabled', () => {
      beforeEach(() => {
        config.get.mockImplementation((key) => {
          if (key === 'featureToggle.businessDetails.updateBusinessDetails') {
            return false
          }
          return true
        })
      })

      test('returns false for all fields regardless of field-level toggle', () => {
        expect(isBusinessFieldAccessible('name')).toBe(false)
        expect(isBusinessFieldAccessible('address')).toBe(false)
        expect(isBusinessFieldAccessible('phone')).toBe(false)
        expect(isBusinessFieldAccessible('email')).toBe(false)
        expect(isBusinessFieldAccessible('vat')).toBe(false)
        expect(isBusinessFieldAccessible('registrationNumber')).toBe(false)
      })
    })

    describe('when the master toggle is enabled', () => {
      beforeEach(() => {
        config.get.mockReturnValue(true)
      })

      test('returns true when field-level toggle is enabled', () => {
        expect(isBusinessFieldAccessible('name')).toBe(true)
      })

      test('returns false when field-level toggle is disabled', () => {
        config.get.mockImplementation((key) => {
          if (key === 'featureToggle.businessDetails.updateBusinessDetailsName') {
            return false
          }
          return true
        })

        expect(isBusinessFieldAccessible('name')).toBe(false)
      })

      test('supports all business field types', () => {
        Object.keys(BUSINESS_FIELDS).forEach((field) => {
          expect(() => isBusinessFieldAccessible(field)).not.toThrow()
        })
      })
    })

    describe('with invalid field names', () => {
      beforeEach(() => {
        config.get.mockReturnValue(true)
      })

      test('throws an error for unknown business fields', () => {
        expect(() => isBusinessFieldAccessible('invalidField')).toThrow('Unknown business field: invalidField')
      })
    })
  })

  describe('getDisabledFieldMessage', () => {
    test('returns a message containing the field label', () => {
      const message = getDisabledFieldMessage('full name')
      expect(message).toContain('full name')
    })

    test('returns the expected error message format', () => {
      const message = getDisabledFieldMessage('full name')
      expect(message).toBe(
        'Sorry, there is a problem with the service. You cannot update your full name right now. Please try again later.'
      )
    })

    test('works with various field labels', () => {
      const labels = [
        'full name',
        'date of birth',
        'personal address',
        'business name',
        'business VAT registration number'
      ]

      labels.forEach((label) => {
        const message = getDisabledFieldMessage(label)
        expect(message).toContain(label)
        expect(message).toContain('cannot update your')
      })
    })
  })

  describe('getDisabledFieldNotification', () => {
    test('returns a notification object with error type', () => {
      const notification = getDisabledFieldNotification('full name')

      expect(notification).toHaveProperty('type', 'error')
      expect(notification).toHaveProperty('titleText', 'Important')
      expect(notification).toHaveProperty('text')
    })

    test('includes the disabled field message in the notification', () => {
      const notification = getDisabledFieldNotification('full name')

      expect(notification.text).toBe(
        'Sorry, there is a problem with the service. You cannot update your full name right now. Please try again later.'
      )
    })

    test('works with various field labels', () => {
      const labels = ['personal address', 'business email address', 'date of birth']

      labels.forEach((label) => {
        const notification = getDisabledFieldNotification(label)
        expect(notification.type).toBe('error')
        expect(notification.titleText).toBe('Important')
        expect(notification.text).toContain(label)
      })
    })
  })
})
