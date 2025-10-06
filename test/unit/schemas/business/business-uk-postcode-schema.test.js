// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessUkPostcodeSchema } from '../../../../src/schemas/business/business-uk-postcode-schema.js'
import { POSTCODE_MAX } from '../../../../src/constants/validation-fields.js'

describe('business UK postcode schema', () => {
  let payload
  let schema

  beforeEach(() => {
    schema = businessUkPostcodeSchema

    payload = {
      businessPostcode: 'BA1 3TF'
    }
  })

  describe('when valid data is provided', () => {
    test('it confirms the data is valid', () => {
      const { error, value } = schema.validate(payload, { abortEarly: false })

      expect(error).toBeUndefined()
      expect(value).toEqual(payload)
    })
  })

  describe('when invalid data is provided', () => {
    describe('because "businessPostcode" is missing', () => {
      beforeEach(() => {
        delete payload.businessPostcode
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter a postcode',
          path: ['businessPostcode'],
          type: 'any.required'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "businessPostcode" is an empty string', () => {
      beforeEach(() => {
        payload.businessPostcode = ''
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter a postcode',
          path: ['businessPostcode'],
          type: 'string.empty'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "businessPostcode" is longer than POSTCODE_MAX characters', () => {
      beforeEach(() => {
        payload.businessPostcode = 'A'.repeat(POSTCODE_MAX + 1)
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: `Postal code must be ${POSTCODE_MAX} characters or less`,
          path: ['businessPostcode'],
          type: 'string.max'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "businessPostcode" is invalid format', () => {
      beforeEach(() => {
        payload.businessPostcode = 'INVALID1'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter a full UK postcode, like AA3 1AB',
          path: ['businessPostcode'],
          type: 'string.pattern.base'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "businessPostcode" is lowercase', () => {
      beforeEach(() => {
        payload.businessPostcode = 'ba1 3tf'
      })

      test('it converts to uppercase and validates', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error).toBeUndefined()
        expect(value.businessPostcode).toEqual('BA1 3TF')
      })
    })
  })
})
