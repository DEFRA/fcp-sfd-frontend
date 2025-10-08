// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { ukPostcodeSchema } from '../../../../src/schemas/os-places/uk-postcode-schema.js'
import { POSTCODE_MAX } from '../../../../src/constants/validation-fields.js'

describe('uk postcode schema', () => {
  let payload
  let schema

  beforeEach(() => {
    schema = ukPostcodeSchema

    payload = {
      postcode: 'BA1 3TF'
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
    describe('because "postcode" is missing', () => {
      beforeEach(() => {
        delete payload.postcode
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter a postcode',
          path: ['postcode'],
          type: 'any.required'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "postcode" is an empty string', () => {
      beforeEach(() => {
        payload.postcode = ''
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter a postcode',
          path: ['postcode'],
          type: 'string.empty'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "postcode" is longer than POSTCODE_MAX characters', () => {
      beforeEach(() => {
        payload.postcode = 'A'.repeat(POSTCODE_MAX + 1)
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: `Postal code must be ${POSTCODE_MAX} characters or less`,
          path: ['postcode'],
          type: 'string.max'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "postcode" is invalid format', () => {
      beforeEach(() => {
        payload.postcode = 'INVALID1'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter a full UK postcode, like AA3 1AB',
          path: ['postcode'],
          type: 'string.pattern.base'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "postcode" is lowercase', () => {
      beforeEach(() => {
        payload.postcode = 'ba1 3tf'
      })

      test('it converts to uppercase and validates', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error).toBeUndefined()
        expect(value.postcode).toEqual('BA1 3TF')
      })
    })
  })
})
