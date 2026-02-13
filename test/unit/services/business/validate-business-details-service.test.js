// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { validateBusinessDetailsService } from '../../../../src/services/business/validate-business-details-service.js'

// Test helpers
import { businessDetailsMapped } from '../../constants/test-business-details.js'

describe('validateBusinessDetailsService', () => {
  let businessDetails

  beforeEach(() => {
    businessDetails = businessDetailsMapped()
  })

  describe('when business details are valid', () => {
    test('returns hasValidBusinessDetails as true', () => {
      const result = validateBusinessDetailsService(businessDetails)

      expect(result.hasValidBusinessDetails).toBe(true)
    })

    test('returns an empty sectionsNeedingUpdate array', () => {
      const result = validateBusinessDetailsService(businessDetails)

      expect(result.sectionsNeedingUpdate).toEqual([])
    })
  })

  describe('when business details are invalid', () => {
    beforeEach(() => {
      businessDetails.info.businessName = ''
    })

    test('returns hasValidBusinessDetails as false', () => {
      const result = validateBusinessDetailsService(businessDetails)

      expect(result.hasValidBusinessDetails).toBe(false)
    })

    test('returns the sections needing update', () => {
      const result = validateBusinessDetailsService(businessDetails)

      expect(result.sectionsNeedingUpdate).toEqual(['businessName'])
    })
  })

  describe('when multiple schema errors map to the same section', () => {
    beforeEach(() => {
      businessDetails.address.lookup.uprn = null
      businessDetails.address.manual.line1 = ''
      businessDetails.address.postcode = ''
    })

    test('only returns the section once', () => {
      const result = validateBusinessDetailsService(businessDetails)

      expect(result.sectionsNeedingUpdate).toEqual(['address'])
    })
  })

  describe('when multiple sections are invalid', () => {
    beforeEach(() => {
      businessDetails.info.businessName = ''
      businessDetails.contact.email = 'not-an-email'
    })

    test('returns all affected sections', () => {
      const result = validateBusinessDetailsService(businessDetails)

      expect(result.sectionsNeedingUpdate).toEqual(['businessName', 'email'])
    })
  })

  describe('when both landline and mobile are missing', () => {
    beforeEach(() => {
      businessDetails.contact.landline = null
      businessDetails.contact.mobile = null
    })

    test('maps the error to the phone section', () => {
      const result = validateBusinessDetailsService(businessDetails)

      expect(result.sectionsNeedingUpdate).toContain('phone')
    })
  })

  describe('when only a landline number is provided', () => {
    beforeEach(() => {
      businessDetails.contact.mobile = null
    })

    test('does not flag the phone section', () => {
      const result = validateBusinessDetailsService(businessDetails)

      expect(result.sectionsNeedingUpdate).not.toContain('phone')
    })
  })

  describe('when only a mobile number is provided', () => {
    beforeEach(() => {
      businessDetails.contact.landline = null
    })

    test('does not flag the phone section', () => {
      const result = validateBusinessDetailsService(businessDetails)

      expect(result.sectionsNeedingUpdate).not.toContain('phone')
    })
  })

  describe('when address validation fails', () => {
    beforeEach(() => {
      businessDetails.address.lookup.uprn = null
      businessDetails.address.manual.line1 = ''
    })

    test('maps the error to the address section', () => {
      const result = validateBusinessDetailsService(businessDetails)

      expect(result.sectionsNeedingUpdate).toEqual(['address'])
    })
  })

  describe('when a UPRN is present', () => {
    beforeEach(() => {
      businessDetails.address.lookup.uprn = '123456789'
      businessDetails.address.manual.line1 = ''
    })

    test('does not return address as needing update', () => {
      const result = validateBusinessDetailsService(businessDetails)

      expect(result.sectionsNeedingUpdate).not.toContain('address')
      expect(result.hasValidBusinessDetails).toBe(true)
    })
  })

  describe('when a VAT number is provided', () => {
    beforeEach(() => {
      businessDetails.info.vat = '123456789'
    })

    test('validates the VAT number', () => {
      const result = validateBusinessDetailsService(businessDetails)

      expect(result.hasValidBusinessDetails).toBe(true)
      expect(result.sectionsNeedingUpdate).toEqual([])
    })
  })

  describe('when an invalid VAT number is provided', () => {
    beforeEach(() => {
      businessDetails.info.vat = 'INVALIDVAT'
    })

    test('returns the VAT section as needing update', () => {
      const result = validateBusinessDetailsService(businessDetails)

      expect(result.hasValidBusinessDetails).toBe(false)
      expect(result.sectionsNeedingUpdate).toEqual(['vat'])
    })
  })

  describe('when no VAT number is provided', () => {
    beforeEach(() => {
      businessDetails.info.vat = null
    })

    test('does not validate the VAT number', () => {
      const result = validateBusinessDetailsService(businessDetails)

      expect(result.hasValidBusinessDetails).toBe(true)
      expect(result.sectionsNeedingUpdate).toEqual([])
    })
  })
})
