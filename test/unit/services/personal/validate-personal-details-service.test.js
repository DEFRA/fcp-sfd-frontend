// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { validatePersonalDetailsService } from '../../../../src/services/personal/validate-personal-details-service.js'

// Test helpers
import { personalDetailsMapped } from '../../constants/test-personal-details.js'

describe('validatePersonalDetailsService', () => {
  let payload
  let yar
  let sessionId

  beforeEach(() => {
    payload = personalDetailsMapped()
    sessionId = 'test-session-id'

    yar = {
      set: vi.fn()
    }
  })

  describe('when personal details are valid', () => {
    test('returns true', () => {
      const result = validatePersonalDetailsService(payload, yar, sessionId)

      expect(result).toBe(true)
    })

    test('marks personal details as validated', () => {
      validatePersonalDetailsService(payload, yar, sessionId)

      expect(payload.validated).toBe(true)
    })

    test('stores successful validation state in the session', () => {
      validatePersonalDetailsService(payload, yar, sessionId)

      expect(yar.set).toHaveBeenCalledWith(sessionId, {
        personalDetailsValid: true,
        validationErrors: undefined
      })
    })
  })

  describe('when personal details are invalid', () => {
    beforeEach(() => {
      // Make the payload invalid
      payload.info.fullName.first = ''
    })

    test('returns false', () => {
      const result = validatePersonalDetailsService(payload, yar, sessionId)

      expect(result).toBe(false)
    })

    test('marks personal details as not validated', () => {
      validatePersonalDetailsService(payload, yar, sessionId)

      expect(payload.validated).toBe(false)
    })

    test('adds validationErrors to the personal details object', () => {
      validatePersonalDetailsService(payload, yar, sessionId)

      expect(payload.validationErrors).toEqual(['name'])
    })

    test('stores failed validation state and errors in the session', () => {
      validatePersonalDetailsService(payload, yar, sessionId)

      expect(yar.set).toHaveBeenCalledWith(sessionId, {
        personalDetailsValid: false,
        validationErrors: ['name']
      })
    })
  })

  describe('when multiple schema errors map to the same form field', () => {
    beforeEach(() => {
      payload.info.fullName.first = ''
      payload.info.fullName.last = ''
    })

    test('only returns the field once', () => {
      validatePersonalDetailsService(payload, yar, sessionId)

      expect(payload.validationErrors).toEqual(['name'])
    })
  })

  describe('when both telephone and mobile are missing', () => {
    beforeEach(() => {
      payload.contact.telephone = null
      payload.contact.mobile = null
    })

    test('maps the error to the phone field', () => {
      validatePersonalDetailsService(payload, yar, sessionId)

      expect(payload.validationErrors).toContain('phone')
    })
  })

  describe('when address validation fails', () => {
    beforeEach(() => {
      payload.address.lookup.uprn = null
      payload.address.manual.line1 = ''
    })

    test('maps the error to the address field', () => {
      validatePersonalDetailsService(payload, yar, sessionId)

      expect(payload.validationErrors).toEqual(['address'])
    })
  })
})
