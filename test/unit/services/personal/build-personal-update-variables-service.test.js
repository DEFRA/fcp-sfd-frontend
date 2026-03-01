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
    test('returns empty object if no sections to fix', () => {
      const result = buildPersonalUpdateVariablesService(personalDetails)

      expect(result).toEqual({})
    })
  })

  describe('when there are changes to name', () => {
    beforeEach(() => {
      personalDetails.orderedSectionsToFix = ['name']
      personalDetails.changePersonalName = { first: 'Janet', middle: null, last: 'Smith' }
    })

    test('builds name input', () => {
      const result = buildPersonalUpdateVariablesService(personalDetails)

      expect(result.updateCustomerNameInput).toEqual({
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

      expect(result.updateCustomerEmailInput).toEqual({
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

      expect(result.updateCustomerPhoneInput).toEqual({
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

      expect(result.updateCustomerDateOfBirthInput).toEqual({
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

      expect(result.updateCustomerAddressInput).toEqual({
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

      expect(result.updateCustomerAddressInput.address).toEqual({
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
