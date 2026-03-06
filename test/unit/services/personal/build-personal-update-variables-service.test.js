// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { buildPersonalUpdateVariablesService } from '../../../../src/services/personal/build-personal-update-variables-service.js'

describe('buildPersonalUpdateVariablesService', () => {
  let personalDetails

  beforeEach(() => {
    personalDetails = basePersonalDetails()
    personalDetails.orderedSectionsToFix = []
  })

  describe('when no sections need updating', () => {
    test('returns object with only crn', () => {
      const result = buildPersonalUpdateVariablesService(personalDetails)

      expect(result).toEqual({ allFieldsInput: { crn: '123456789' } })
    })
  })

  describe('when multiple sections are partially missing', () => {
    beforeEach(() => {
      personalDetails.orderedSectionsToFix = ['name', 'email', 'phone', 'dob', 'address']
      personalDetails.changePersonalName = { first: 'Alice', last: 'Jones' }
      personalDetails.changePersonalEmail = { personalEmail: 'newEmail@example.com' }
      personalDetails.changePersonalPhoneNumbers = { personalTelephone: null, personalMobile: '07123456789' }
      personalDetails.changePersonalDob = { day: '15', month: '06', year: '1990' }
      personalDetails.changePersonalAddress = {
        address1: '10 Downing St',
        city: 'London',
        postcode: 'SW1A 2AA',
        country: 'UK'
        // missing optional fields
      }
    })

    test('builds allFieldsInput with defaults for missing fields', () => {
      const result = buildPersonalUpdateVariablesService(personalDetails)

      expect(result.allFieldsInput).toEqual({
        crn: '123456789',
        first: 'Alice',
        middle: null,
        last: 'Jones',
        email: { address: 'newEmail@example.com' },
        phone: { landline: null, mobile: '07123456789' },
        dateOfBirth: '1990-06-15',
        address: {
          buildingNumberRange: null,
          buildingName: null,
          flatName: null,
          street: null,
          city: 'London',
          county: null,
          postalCode: 'SW1A 2AA',
          country: 'UK',
          line1: '10 Downing St',
          line2: null,
          line3: null,
          line4: 'London',
          line5: null,
          uprn: null
        }
      })
    })
  })

  describe('when there are changes to name', () => {
    beforeEach(() => {
      personalDetails.orderedSectionsToFix = ['name']
      personalDetails.changePersonalName = { first: 'Janet', middle: null, last: 'Smith' }
    })

    test('builds name input', () => {
      const result = buildPersonalUpdateVariablesService(personalDetails)

      expect(result.allFieldsInput).toEqual({
        crn: '123456789',
        first: 'Janet',
        middle: null,
        last: 'Smith'
      })
    })
  })

  describe('when there are changes to email', () => {
    beforeEach(() => {
      personalDetails.orderedSectionsToFix = ['email']
      personalDetails.changePersonalEmail = { personalEmail: 'new.email@example.com' }
    })

    test('builds email input', () => {
      const result = buildPersonalUpdateVariablesService(personalDetails)

      expect(result.allFieldsInput).toEqual({
        crn: '123456789',
        email: { address: 'new.email@example.com' }
      })
    })
  })

  describe('when there are changes to phone', () => {
    beforeEach(() => {
      personalDetails.orderedSectionsToFix = ['phone']
      personalDetails.changePersonalPhoneNumbers = {
        personalTelephone: '0123456789',
        personalMobile: '07999999999'
      }
    })

    test('builds phone input', () => {
      const result = buildPersonalUpdateVariablesService(personalDetails)

      expect(result.allFieldsInput).toEqual({
        crn: '123456789',
        phone: { landline: '0123456789', mobile: '07999999999' }
      })
    })
  })

  describe('when there are changes to date of birth', () => {
    beforeEach(() => {
      personalDetails.orderedSectionsToFix = ['dob']
      personalDetails.changePersonalDob = { day: '01', month: '12', year: '1985' }
    })

    test('builds dob input', () => {
      const result = buildPersonalUpdateVariablesService(personalDetails)

      expect(result.allFieldsInput).toEqual({
        crn: '123456789',
        dateOfBirth: '1985-12-01'
      })
    })
  })

  describe('when there are changes to address', () => {
    beforeEach(() => {
      personalDetails.orderedSectionsToFix = ['address']
      personalDetails.changePersonalAddress = {
        address1: '1 New Road',
        address2: 'Flat 2',
        city: 'Bristol',
        county: 'Avon',
        postcode: 'BS1 1AA',
        country: 'UK'
      }
    })

    test('builds address input', () => {
      const result = buildPersonalUpdateVariablesService(personalDetails)

      expect(result.allFieldsInput).toEqual({
        crn: '123456789',
        address: {
          buildingNumberRange: null,
          buildingName: null,
          flatName: null,
          street: null,
          city: 'Bristol',
          county: 'Avon',
          postalCode: 'BS1 1AA',
          country: 'UK',
          line1: '1 New Road',
          line2: 'Flat 2',
          line3: null,
          line4: 'Bristol',
          line5: 'Avon',
          uprn: null
        }
      })
    })

    test('defaults missing optional fields to null', () => {
      personalDetails.changePersonalAddress = {
        address1: '1 New Road',
        city: 'Bristol',
        postcode: 'BS1 1AA',
        country: 'UK'
      }
      const result = buildPersonalUpdateVariablesService(personalDetails)

      expect(result.allFieldsInput.address).toEqual({
        buildingNumberRange: null,
        buildingName: null,
        flatName: null,
        street: null,
        city: 'Bristol',
        county: null,
        postalCode: 'BS1 1AA',
        country: 'UK',
        line1: '1 New Road',
        line2: null,
        line3: null,
        line4: 'Bristol',
        line5: null,
        uprn: null
      })
    })
  })
})

const basePersonalDetails = () => {
  return {
    crn: '123456789',
    orderedSectionsToFix: []
  }
}
