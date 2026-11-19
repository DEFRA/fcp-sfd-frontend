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
          // Only the master toggle is off, every field-level toggle is on
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

      describe('and the field is "name"', () => {
        test('it returns true', () => {
          const result = isPersonalFieldAccessible('name')

          expect(result).toBe(true)
        })
      })

      describe('and the field is "dob"', () => {
        test('it returns true', () => {
          const result = isPersonalFieldAccessible('dob')

          expect(result).toBe(true)
        })
      })

      describe('and the field is "address"', () => {
        test('it returns true', () => {
          const result = isPersonalFieldAccessible('address')

          expect(result).toBe(true)
        })
      })

      describe('and the field is "phone"', () => {
        test('it returns true', () => {
          const result = isPersonalFieldAccessible('phone')

          expect(result).toBe(true)
        })
      })

      describe('and the field is "email"', () => {
        test('it returns true', () => {
          const result = isPersonalFieldAccessible('email')

          expect(result).toBe(true)
        })
      })
    })

    describe('with invalid field names', () => {
      beforeEach(() => {
        config.get.mockReturnValue(true)
      })

      test('throws an error for unknown personal fields', () => {
        let error

        try {
          isPersonalFieldAccessible('invalidField')
        } catch (thrownError) {
          error = thrownError
        }

        expect(error.message).toBe('Unknown personal field: invalidField')
      })
    })

    describe('with an invalid field name and the master toggle disabled', () => {
      beforeEach(() => {
        config.get.mockReturnValue(false)
      })

      test('throws an error for unknown personal fields', () => {
        let error

        try {
          isPersonalFieldAccessible('invalidField')
        } catch (thrownError) {
          error = thrownError
        }

        expect(error.message).toBe('Unknown personal field: invalidField')
      })
    })
  })

  describe('isBusinessFieldAccessible', () => {
    describe('when the master toggle is disabled', () => {
      beforeEach(() => {
        config.get.mockImplementation((key) => {
          // Only the master toggle is off, every field-level toggle is on
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

      describe('and the field is "name"', () => {
        test('it returns true', () => {
          const result = isBusinessFieldAccessible('name')

          expect(result).toBe(true)
        })
      })

      describe('and the field is "address"', () => {
        test('it returns true', () => {
          const result = isBusinessFieldAccessible('address')

          expect(result).toBe(true)
        })
      })

      describe('and the field is "phone"', () => {
        test('it returns true', () => {
          const result = isBusinessFieldAccessible('phone')

          expect(result).toBe(true)
        })
      })

      describe('and the field is "email"', () => {
        test('it returns true', () => {
          const result = isBusinessFieldAccessible('email')

          expect(result).toBe(true)
        })
      })

      describe('and the field is "vat"', () => {
        test('it returns true', () => {
          const result = isBusinessFieldAccessible('vat')

          expect(result).toBe(true)
        })
      })

      describe('and the field is "registrationNumber"', () => {
        test('it returns true', () => {
          const result = isBusinessFieldAccessible('registrationNumber')

          expect(result).toBe(true)
        })
      })
    })

    describe('with invalid field names', () => {
      beforeEach(() => {
        config.get.mockReturnValue(true)
      })

      test('throws an error for unknown business fields', () => {
        let error

        try {
          isBusinessFieldAccessible('invalidField')
        } catch (thrownError) {
          error = thrownError
        }

        expect(error.message).toBe('Unknown business field: invalidField')
      })
    })

    describe('with an invalid field name and the master toggle disabled', () => {
      beforeEach(() => {
        config.get.mockReturnValue(false)
      })

      test('throws an error for unknown business fields', () => {
        let error

        try {
          isBusinessFieldAccessible('invalidField')
        } catch (thrownError) {
          error = thrownError
        }

        expect(error.message).toBe('Unknown business field: invalidField')
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

    describe('when the label is "full name"', () => {
      test('it includes the label in the message', () => {
        const message = getDisabledFieldMessage('full name')

        expect(message).toContain('full name')
        expect(message).toContain('cannot update your')
      })
    })

    describe('when the label is "date of birth"', () => {
      test('it includes the label in the message', () => {
        const message = getDisabledFieldMessage('date of birth')

        expect(message).toContain('date of birth')
        expect(message).toContain('cannot update your')
      })
    })

    describe('when the label is "personal address"', () => {
      test('it includes the label in the message', () => {
        const message = getDisabledFieldMessage('personal address')

        expect(message).toContain('personal address')
        expect(message).toContain('cannot update your')
      })
    })

    describe('when the label is "business name"', () => {
      test('it includes the label in the message', () => {
        const message = getDisabledFieldMessage('business name')

        expect(message).toContain('business name')
        expect(message).toContain('cannot update your')
      })
    })

    describe('when the label is "business VAT registration number"', () => {
      test('it includes the label in the message', () => {
        const message = getDisabledFieldMessage('business VAT registration number')

        expect(message).toContain('business VAT registration number')
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

    describe('when the label is "personal address"', () => {
      test('it returns an error notification containing the label', () => {
        const notification = getDisabledFieldNotification('personal address')

        expect(notification.type).toBe('error')
        expect(notification.titleText).toBe('Important')
        expect(notification.text).toContain('personal address')
      })
    })

    describe('when the label is "business email address"', () => {
      test('it returns an error notification containing the label', () => {
        const notification = getDisabledFieldNotification('business email address')

        expect(notification.type).toBe('error')
        expect(notification.titleText).toBe('Important')
        expect(notification.text).toContain('business email address')
      })
    })

    describe('when the label is "date of birth"', () => {
      test('it returns an error notification containing the label', () => {
        const notification = getDisabledFieldNotification('date of birth')

        expect(notification.type).toBe('error')
        expect(notification.titleText).toBe('Important')
        expect(notification.text).toContain('date of birth')
      })
    })
  })
})
