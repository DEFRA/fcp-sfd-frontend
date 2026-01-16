// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { validatePersonalDetailsService } from '../../../../src/services/personal/validate-personal-details-service.js'

// Test helpers
import { personalDetailsMapped } from '../../constants/test-personal-details.js'

describe('validatePersonalDetailsService', () => {
  let payload

  beforeEach(() => {
    payload = personalDetailsMapped()
  })

  describe('when personal details are valid', () => {
    test('returns hasValidPersonalDetails as true', () => {
      const result = validatePersonalDetailsService(payload)

      expect(result.hasValidPersonalDetails).toBe(true)
    })

    test('returns an empty sectionsNeedingUpdate array', () => {
      const result = validatePersonalDetailsService(payload)

      expect(result.sectionsNeedingUpdate).toEqual([])
    })
  })

  describe('when personal details are invalid', () => {
    beforeEach(() => {
      payload.info.fullName.first = ''
    })

    test('returns hasValidPersonalDetails as false', () => {
      const result = validatePersonalDetailsService(payload)

      expect(result.hasValidPersonalDetails).toBe(false)
    })

    test('returns the sections needing update', () => {
      const result = validatePersonalDetailsService(payload)

      expect(result.sectionsNeedingUpdate).toEqual(['name'])
    })
  })

  describe('when multiple schema errors map to the same section', () => {
    beforeEach(() => {
      payload.info.fullName.first = ''
      payload.info.fullName.last = ''
    })

    test('only returns the section once', () => {
      const result = validatePersonalDetailsService(payload)

      expect(result.sectionsNeedingUpdate).toEqual(['name'])
    })
  })

  describe('when multiple sections are invalid', () => {
    beforeEach(() => {
      payload.info.fullName.first = ''
      payload.contact.email = 'not-an-email'
    })

    test('returns all affected sections', () => {
      const result = validatePersonalDetailsService(payload)

      expect(result.sectionsNeedingUpdate).toEqual(['name', 'email'])
    })
  })

  describe('when both telephone and mobile are missing', () => {
    beforeEach(() => {
      payload.contact.telephone = null
      payload.contact.mobile = null
    })

    test('maps the error to the phone section', () => {
      const result = validatePersonalDetailsService(payload)

      expect(result.sectionsNeedingUpdate).toContain('phone')
    })
  })

  describe('when address validation fails', () => {
    beforeEach(() => {
      payload.address.lookup.uprn = null
      payload.address.manual.line1 = ''
    })

    test('maps the error to the address section', () => {
      const result = validatePersonalDetailsService(payload)

      expect(result.sectionsNeedingUpdate).toEqual(['address'])
    })
  })

  describe('when date of birth is completely missing', () => {
    beforeEach(() => {
      payload.info.dateOfBirth.day = ''
      payload.info.dateOfBirth.month = ''
      payload.info.dateOfBirth.year = ''
    })

    test('maps the error to the dob section', () => {
      const result = validatePersonalDetailsService(payload)

      expect(result.sectionsNeedingUpdate).toEqual(['dob'])
    })
  })

  describe('when date of birth is invalid', () => {
    beforeEach(() => {
      payload.info.dateOfBirth.day = '31'
      payload.info.dateOfBirth.month = '2'
      payload.info.dateOfBirth.year = '2020'
    })

    test('maps the error to the dob section', () => {
      const result = validatePersonalDetailsService(payload)

      expect(result.sectionsNeedingUpdate).toEqual(['dob'])
    })
  })

  describe('when date of birth is in the future', () => {
    beforeEach(() => {
      payload.info.dateOfBirth.day = '1'
      payload.info.dateOfBirth.month = '1'
      payload.info.dateOfBirth.year = '3000'
    })

    test('maps the error to the dob section', () => {
      const result = validatePersonalDetailsService(payload)

      expect(result.sectionsNeedingUpdate).toEqual(['dob'])
    })
  })
})
