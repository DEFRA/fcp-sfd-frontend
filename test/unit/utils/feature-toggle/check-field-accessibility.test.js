// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Mocks
import { config } from '../../../../src/config/index.js'

// Thing under test
import {
  isPersonalFieldAccessible,
  isBusinessFieldAccessible,
  getPersonalFieldDisplayName,
  getBusinessFieldDisplayName,
  getDisabledFieldNotification,
  findDisabledPersonalField,
  findDisabledBusinessField,
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
    test('contains all personal field mappings with display names', () => {
      expect(PERSONAL_FIELDS).toEqual({
        name: {
          toggleName: 'updatePersonalDetailsName',
          displayName: 'full name'
        },
        dob: {
          toggleName: 'updatePersonalDetailsDob',
          displayName: 'date of birth'
        },
        address: {
          toggleName: 'updatePersonalDetailsAddress',
          displayName: 'personal address'
        },
        phone: {
          toggleName: 'updatePersonalDetailsPhone',
          displayName: 'personal phone numbers'
        },
        email: {
          toggleName: 'updatePersonalDetailsEmail',
          displayName: 'personal email address'
        }
      })
    })
  })

  describe('BUSINESS_FIELDS', () => {
    test('contains all business field mappings with display names', () => {
      expect(BUSINESS_FIELDS).toEqual({
        name: {
          toggleName: 'updateBusinessDetailsName',
          displayName: 'business name'
        },
        address: {
          toggleName: 'updateBusinessDetailsAddress',
          displayName: 'business address'
        },
        phone: {
          toggleName: 'updateBusinessDetailsPhone',
          displayName: 'business phone numbers'
        },
        email: {
          toggleName: 'updateBusinessDetailsEmail',
          displayName: 'business email address'
        },
        vat: {
          toggleName: 'updateBusinessDetailsVat',
          displayName: 'VAT registration number'
        },
        registrationNumber: {
          toggleName: 'updateBusinessDetailsRegistrationNumber',
          displayName: 'registration number'
        }
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

  describe('getDisabledFieldNotification', () => {
    test('returns a notification object with error type', () => {
      const notification = getDisabledFieldNotification('full name')

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

        expect(notification.titleText).toBe('Important')
        expect(notification.text).toContain('personal address')
      })
    })

    describe('when the label is "business email address"', () => {
      test('it returns an error notification containing the label', () => {
        const notification = getDisabledFieldNotification('business email address')

        expect(notification.titleText).toBe('Important')
        expect(notification.text).toContain('business email address')
      })
    })

    describe('when the label is "date of birth"', () => {
      test('it returns an error notification containing the label', () => {
        const notification = getDisabledFieldNotification('date of birth')

        expect(notification.titleText).toBe('Important')
        expect(notification.text).toContain('date of birth')
      })
    })
  })

  describe('getPersonalFieldDisplayName', () => {
    test('returns the display name for "name"', () => {
      const displayName = getPersonalFieldDisplayName('name')
      expect(displayName).toBe('full name')
    })

    test('returns the display name for "dob"', () => {
      const displayName = getPersonalFieldDisplayName('dob')
      expect(displayName).toBe('date of birth')
    })

    test('returns the display name for "address"', () => {
      const displayName = getPersonalFieldDisplayName('address')
      expect(displayName).toBe('personal address')
    })

    test('returns the display name for "phone"', () => {
      const displayName = getPersonalFieldDisplayName('phone')
      expect(displayName).toBe('personal phone numbers')
    })

    test('returns the display name for "email"', () => {
      const displayName = getPersonalFieldDisplayName('email')
      expect(displayName).toBe('personal email address')
    })

    test('throws an error for unknown fields', () => {
      let error

      try {
        getPersonalFieldDisplayName('unknown')
      } catch (thrownError) {
        error = thrownError
      }

      expect(error.message).toBe('Unknown personal field: unknown')
    })
  })

  describe('getBusinessFieldDisplayName', () => {
    test('returns the display name for "name"', () => {
      const displayName = getBusinessFieldDisplayName('name')
      expect(displayName).toBe('business name')
    })

    test('returns the display name for "address"', () => {
      const displayName = getBusinessFieldDisplayName('address')
      expect(displayName).toBe('business address')
    })

    test('returns the display name for "vat"', () => {
      const displayName = getBusinessFieldDisplayName('vat')
      expect(displayName).toBe('VAT registration number')
    })

    test('throws an error for unknown fields', () => {
      let error

      try {
        getBusinessFieldDisplayName('unknown')
      } catch (thrownError) {
        error = thrownError
      }

      expect(error.message).toBe('Unknown business field: unknown')
    })
  })

  describe('findDisabledPersonalField', () => {
    beforeEach(() => {
      config.get.mockReturnValue(true)
    })

    describe('when all fields are accessible', () => {
      test('returns null', () => {
        const result = findDisabledPersonalField(['name', 'dob', 'address'])

        expect(result).toBeNull()
      })
    })

    describe('when one field is disabled', () => {
      beforeEach(() => {
        config.get.mockImplementation((key) => {
          if (key === 'featureToggle.personalDetails.updatePersonalDetailsName') {
            return false
          }
          return true
        })
      })

      test('returns the first disabled field with its display name', () => {
        const result = findDisabledPersonalField(['name', 'dob', 'address'])

        expect(result).toEqual({
          field: 'name',
          displayName: 'full name'
        })
      })
    })

    describe('when multiple fields are disabled', () => {
      beforeEach(() => {
        config.get.mockImplementation((key) => {
          if (key === 'featureToggle.personalDetails.updatePersonalDetailsName' ||
              key === 'featureToggle.personalDetails.updatePersonalDetailsDob') {
            return false
          }
          return true
        })
      })

      test('returns the first disabled field only', () => {
        const result = findDisabledPersonalField(['name', 'dob', 'address'])

        expect(result).toEqual({
          field: 'name',
          displayName: 'full name'
        })
      })
    })

    describe('when the master toggle is disabled', () => {
      beforeEach(() => {
        config.get.mockImplementation((key) => {
          if (key === 'featureToggle.personalDetails.updatePersonalDetails') {
            return false
          }
          return true
        })
      })

      test('returns the whole section as disabled', () => {
        const result = findDisabledPersonalField(['name', 'dob', 'address'])

        expect(result).toEqual({
          field: 'all',
          displayName: 'personal details'
        })
      })
    })
  })

  describe('findDisabledBusinessField', () => {
    beforeEach(() => {
      config.get.mockReturnValue(true)
    })

    describe('when all fields are accessible', () => {
      test('returns null', () => {
        const result = findDisabledBusinessField(['name', 'address', 'vat'])

        expect(result).toBeNull()
      })
    })

    describe('when one field is disabled', () => {
      beforeEach(() => {
        config.get.mockImplementation((key) => {
          if (key === 'featureToggle.businessDetails.updateBusinessDetailsVat') {
            return false
          }
          return true
        })
      })

      test('returns the first disabled field with its display name', () => {
        const result = findDisabledBusinessField(['name', 'address', 'vat'])

        expect(result).toEqual({
          field: 'vat',
          displayName: 'VAT registration number'
        })
      })
    })

    describe('when the master toggle is disabled', () => {
      beforeEach(() => {
        config.get.mockImplementation((key) => {
          if (key === 'featureToggle.businessDetails.updateBusinessDetails') {
            return false
          }
          return true
        })
      })

      test('returns the whole section as disabled', () => {
        const result = findDisabledBusinessField(['name', 'address', 'vat'])

        expect(result).toEqual({
          field: 'all',
          displayName: 'business details'
        })
      })
    })
  })
})
