// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { buildBusinessUpdateVariablesService } from '../../../../src/services/business/build-business-update-variables-service.js'

describe('buildBusinessUpdateVariablesService', () => {
  let businessDetails

  beforeEach(() => {
    businessDetails = baseBusinessDetails()
    businessDetails.orderedSectionsToFix = []
  })

  describe('when no sections need updating', () => {
    test('returns an empty object', () => {
      const result = buildBusinessUpdateVariablesService(businessDetails)

      expect(result).toEqual({})
    })
  })

  describe('when only the name section needs updating', () => {
    beforeEach(() => {
      businessDetails.orderedSectionsToFix = ['name']
      businessDetails.changeBusinessName = { businessName: 'New Business Ltd' }
    })

    test('builds only the name variable', () => {
      const result = buildBusinessUpdateVariablesService(businessDetails)

      expect(result).toEqual({
        updateBusinessNameInput: {
          sbi: '106705779',
          name: 'New Business Ltd'
        }
      })
    })
  })

  describe('when multiple sections need updating', () => {
    beforeEach(() => {
      businessDetails.orderedSectionsToFix = ['name', 'email', 'vat', 'phone', 'address']
      businessDetails.changeBusinessName = { businessName: 'New Business Ltd' }
      businessDetails.changeBusinessEmail = { businessEmail: 'new@business.com' }
      businessDetails.changeBusinessVat = { vatNumber: '987654321' }
      businessDetails.changeBusinessPhoneNumbers = { businessTelephone: null, businessMobile: '07999999999' }
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

    test('builds variables only for the sections listed', () => {
      const result = buildBusinessUpdateVariablesService(businessDetails)

      expect(result.updateBusinessNameInput).toEqual({
        sbi: '106705779',
        name: 'New Business Ltd'
      })

      expect(result.updateBusinessEmailInput).toEqual({
        sbi: '106705779',
        email: { address: 'new@business.com' }
      })

      expect(result.updateBusinessVATInput).toEqual({
        sbi: '106705779',
        vat: '987654321'
      })

      expect(result.updateBusinessPhoneInput).toEqual({
        sbi: '106705779',
        phone: { landline: null, mobile: '07999999999' }
      })

      expect(result.updateBusinessAddressInput).toEqual({
        sbi: '106705779',
        address: {
          withoutUprn: {
            pafOrganisationName: null,
            buildingNumberRange: null,
            buildingName: null,
            flatName: null,
            street: null,
            dependentLocality: null,
            doubleDependentLocality: null,
            county: null,
            uprn: null,
            line1: '100 New Street',
            line2: 'Suite 5',
            line3: null,
            line4: 'Yorkshire',
            line5: null,
            city: 'Leeds',
            postalCode: 'LS1 1AA',
            country: 'UK'
          }
        }
      })
    })
  })

  describe('when vat is an empty strings', () => {
    beforeEach(() => {
      businessDetails.orderedSectionsToFix = ['vat']
      businessDetails.changeBusinessVat = ''
    })

    test('builds variables with empty strings', () => {
      const result = buildBusinessUpdateVariablesService(businessDetails)

      expect(result).toEqual({
        updateBusinessVATInput: { sbi: '106705779', vat: '' }
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
