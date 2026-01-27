// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { buildPersonalUpdateVariables } from '../../../../src/services/personal/build-personal-update-variables-service.js'

describe('buildPersonalUpdateVariables', () => {
  let personalDetails

  describe('when there are no changes to personal details', () => {
    beforeEach(() => {
      personalDetails = basePersonalDetails()
    })

    test('it builds mutation variables using existing personal details', () => {
      const result = buildPersonalUpdateVariables(personalDetails)

      expect(result).toEqual({
        updateCustomerNameInput: {
          crn: '123456789',
          first: 'Jane',
          middle: 'Alice',
          last: 'Doe'
        },
        updateCustomerEmailInput: {
          crn: '123456789',
          email: {
            address: 'jane.doe@example.com'
          }
        },
        updateCustomerPhoneInput: {
          crn: '123456789',
          phone: {
            landline: '0123456789',
            mobile: '07123456789'
          }
        },
        updateCustomerDateOfBirthInput: {
          crn: '123456789',
          dateOfBirth: '1990-05-20'
        },
        updateCustomerAddressInput: {
          crn: '123456789',
          address: {
            buildingNumberRange: '10',
            buildingName: null,
            flatName: null,
            street: 'High Street',
            city: 'Bath',
            county: 'Somerset',
            postalCode: 'BA1 1AA',
            country: 'UK',
            dependentLocality: null,
            doubleDependentLocality: null,
            line1: null,
            line2: null,
            line3: null,
            line4: null,
            line5: null,
            uprn: '1234567890'
          }
        }
      })
    })
  })

  describe('when there are changes to personal name', () => {
    beforeEach(() => {
      personalDetails = basePersonalDetails()
      personalDetails.changePersonalName = {
        first: 'Janet',
        middle: null,
        last: 'Smith'
      }
    })

    test('it builds mutation variables using changed personal name', () => {
      const result = buildPersonalUpdateVariables(personalDetails)

      expect(result.updateCustomerNameInput).toEqual({
        crn: '123456789',
        first: 'Janet',
        middle: null,
        last: 'Smith'
      })
    })
  })

  describe('when there are changes to date of birth', () => {
    beforeEach(() => {
      personalDetails = basePersonalDetails()
      personalDetails.changePersonalDob = {
        day: '01',
        month: '12',
        year: '1985'
      }
    })

    test('it builds mutation variables using changed personal date of birth', () => {
      const result = buildPersonalUpdateVariables(personalDetails)

      expect(result.updateCustomerDateOfBirthInput).toEqual({
        crn: '123456789',
        dateOfBirth: '1985-12-01'
      })
    })
  })

  describe('when there are changes to personal mobile', () => {
    beforeEach(() => {
      personalDetails = basePersonalDetails()
      personalDetails.changePersonalPhoneNumbers = {
        personalTelephone: null,
        personalMobile: '07999999999'
      }
    })

    test('it builds mutation variables using changed personal mobile', () => {
      const result = buildPersonalUpdateVariables(personalDetails)

      expect(result.updateCustomerPhoneInput).toEqual({
        crn: '123456789',
        phone: {
          landline: null,
          mobile: '07999999999'
        }
      })
    })
  })

  describe('when there are changes to personal telephone', () => {
    beforeEach(() => {
      personalDetails = basePersonalDetails()
      personalDetails.changePersonalPhoneNumbers = {
        personalTelephone: '0123456789',
        personalMobile: null
      }
    })

    test('it builds mutation variables using changed personal telephone', () => {
      const result = buildPersonalUpdateVariables(personalDetails)

      expect(result.updateCustomerPhoneInput).toEqual({
        crn: '123456789',
        phone: {
          landline: '0123456789',
          mobile: null
        }
      })
    })
  })

  describe('when there are changes to personal email', () => {
    beforeEach(() => {
      personalDetails = basePersonalDetails()
      personalDetails.changePersonalEmail = {
        personalEmail: 'new.email@example.com'
      }
    })

    test('it builds mutation variables using changed personal email', () => {
      const result = buildPersonalUpdateVariables(personalDetails)

      expect(result.updateCustomerEmailInput).toEqual({
        crn: '123456789',
        email: {
          address: 'new.email@example.com'
        }
      })
    })
  })

  describe('when there are changes to personal address', () => {
    beforeEach(() => {
      personalDetails = basePersonalDetails()
      personalDetails.changePersonalAddress = {
        address1: '1 New Road',
        address2: 'Flat 2',
        address3: null,
        city: 'Bristol',
        county: 'Avon',
        postcode: 'BS1 1AA',
        country: 'UK'
      }
    })

    test('it builds mutation variables using changed personal address', () => {
      const result = buildPersonalUpdateVariables(personalDetails)

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
  })
})

const basePersonalDetails = () => {
  return {
    crn: '123456789',
    info: {
      fullName: {
        first: 'Jane',
        middle: 'Alice',
        last: 'Doe'
      },
      dateOfBirth: new Date('1990-05-20')
    },
    contact: {
      email: 'jane.doe@example.com',
      telephone: '0123456789',
      mobile: '07123456789'
    },
    address: {
      uprn: '1234567890',
      buildingNumberRange: '10',
      street: 'High Street',
      city: 'Bath',
      county: 'Somerset',
      postcode: 'BA1 1AA',
      country: 'UK'
    }
  }
}
