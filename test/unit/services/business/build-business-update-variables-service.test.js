// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { buildBusinessUpdateVariables } from '../../../../src/services/business/build-business-update-variables-service.js'

describe('buildBusinessUpdateVariables', () => {
  let businessDetails

  describe('when there are no changes to business details', () => {
    beforeEach(() => {
      businessDetails = baseBusinessDetails()
    })

    test('it builds mutation variables using existing business details', () => {
      const result = buildBusinessUpdateVariables(businessDetails)

      expect(result).toEqual({
        updateBusinessNameInput: {
          sbi: '106705779',
          name: 'Test Business Ltd'
        },
        updateBusinessEmailInput: {
          sbi: '106705779',
          email: {
            address: 'test@business.com'
          }
        },
        updateBusinessPhoneInput: {
          sbi: '106705779',
          phone: {
            landline: '0123456789',
            mobile: null
          }
        },
        updateBusinessVATInput: {
          sbi: '106705779',
          vat: '123456789'
        },
        updateBusinessAddressInput: {
          sbi: '106705779',
          address: {
            withUprn: {
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
        }
      })
    })
  })

  describe('when address lookup fields are missing', () => {
    beforeEach(() => {
      businessDetails = baseBusinessDetails()
      businessDetails.address = {
        lookup: { uprn: '1234567890' }
      }
    })

    test('it defaults missing lookup fields to null', () => {
      const result = buildBusinessUpdateVariables(businessDetails)

      expect(result.updateBusinessAddressInput.address.withUprn).toMatchObject({
        buildingNumberRange: null,
        street: null,
        city: null,
        county: null
      })
    })
  })

  describe('when the existing address is manual', () => {
    beforeEach(() => {
      businessDetails = baseBusinessDetails()
      businessDetails.address = {
        lookup: { uprn: null },
        manual: {
          line1: '1 New Road',
          line2: 'Unit 2',
          line3: null,
          line4: 'Bristol',
          line5: 'Avon'
        },
        postcode: 'BS1 1AA',
        country: 'UK'
      }
    })

    test('it builds mutation variables using existing manual address', () => {
      const result = buildBusinessUpdateVariables(businessDetails)

      expect(result.updateBusinessAddressInput.address.withoutUprn).toEqual({
        buildingNumberRange: null,
        buildingName: null,
        flatName: null,
        street: null,
        dependentLocality: null,
        doubleDependentLocality: null,
        city: 'Bristol',
        county: 'Avon',
        postalCode: 'BS1 1AA',
        country: 'UK',
        line1: '1 New Road',
        line2: 'Unit 2',
        line3: null,
        line4: 'Bristol',
        line5: 'Avon',
        uprn: null
      })
    })
  })

  describe('when the VAT number is null', () => {
    beforeEach(() => {
      businessDetails = baseBusinessDetails()
      businessDetails.info.vat = null
    })

    test('it sets VAT to an empty string', () => {
      const result = buildBusinessUpdateVariables(businessDetails)

      expect(result.updateBusinessVATInput).toEqual({
        sbi: '106705779',
        vat: ''
      })
    })
  })

  describe('when there are changes to business name', () => {
    beforeEach(() => {
      businessDetails = baseBusinessDetails()
      businessDetails.changeBusinessName = {
        businessName: 'New Business Ltd'
      }
    })

    test('it builds mutation variables using changed business name', () => {
      const result = buildBusinessUpdateVariables(businessDetails)

      expect(result.updateBusinessNameInput).toEqual({
        sbi: '106705779',
        name: 'New Business Ltd'
      })
    })
  })

  describe('when there are changes to business VAT', () => {
    beforeEach(() => {
      businessDetails = baseBusinessDetails()
      businessDetails.changeBusinessVat = {
        vatNumber: '987654321'
      }
    })

    test('it builds mutation variables using changed VAT number', () => {
      const result = buildBusinessUpdateVariables(businessDetails)

      expect(result.updateBusinessVATInput).toEqual({
        sbi: '106705779',
        vat: '987654321'
      })
    })
  })

  describe('when there are changes to business phone numbers', () => {
    beforeEach(() => {
      businessDetails = baseBusinessDetails()
      businessDetails.changeBusinessPhoneNumbers = {
        businessTelephone: null,
        businessMobile: '07999999999'
      }
    })

    test('it builds mutation variables using changed phone numbers', () => {
      const result = buildBusinessUpdateVariables(businessDetails)

      expect(result.updateBusinessPhoneInput).toEqual({
        sbi: '106705779',
        phone: {
          landline: null,
          mobile: '07999999999'
        }
      })
    })
  })

  describe('when there are changes to business email', () => {
    beforeEach(() => {
      businessDetails = baseBusinessDetails()
      businessDetails.changeBusinessEmail = {
        businessEmail: 'new@business.com'
      }
    })

    test('it builds mutation variables using changed email', () => {
      const result = buildBusinessUpdateVariables(businessDetails)

      expect(result.updateBusinessEmailInput).toEqual({
        sbi: '106705779',
        email: {
          address: 'new@business.com'
        }
      })
    })
  })

  describe('when there are changes to business address', () => {
    beforeEach(() => {
      businessDetails = baseBusinessDetails()

      businessDetails.changeBusinessAddress = {
        address1: '100 New Street',
        address2: 'Suite 5',
        address3: null,
        city: 'Leeds',
        county: 'Yorkshire',
        postcode: 'LS1 1AA',
        country: 'UK'
      }
    })

    test('it builds mutation variables using changed manual address', () => {
      const result = buildBusinessUpdateVariables(businessDetails)

      expect(result.updateBusinessAddressInput).toEqual({
        sbi: '106705779',
        address: {
          withoutUprn: {
            buildingNumberRange: null,
            buildingName: null,
            flatName: null,
            street: null,
            city: 'Leeds',
            county: 'Yorkshire',
            postalCode: 'LS1 1AA',
            country: 'UK',
            line1: '100 New Street',
            line2: 'Suite 5',
            line3: null,
            line4: 'Leeds',
            line5: 'Yorkshire',
            uprn: null
          }
        }
      })
    })
  })
})

const baseBusinessDetails = () => ({
  info: {
    sbi: '106705779',
    businessName: 'Test Business Ltd',
    vat: '123456789'
  },
  contact: {
    email: 'test@business.com',
    landline: '0123456789',
    mobile: null
  },
  address: {
    lookup: {
      buildingNumberRange: '10',
      street: 'High Street',
      city: 'Bath',
      county: 'Somerset',
      uprn: '1234567890'
    },
    manual: {
      line1: null,
      line2: null,
      line3: null,
      line4: null,
      line5: null
    },
    postcode: 'BA1 1AA',
    country: 'UK'
  }
})
