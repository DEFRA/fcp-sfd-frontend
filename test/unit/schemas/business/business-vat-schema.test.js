// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessVatSchema } from '../../../../src/schemas/business/business-vat-schema.js'

describe('business VAT schema', () => {
  let payload
  let schema

  beforeEach(() => {
    schema = businessVatSchema

    payload = {
      vatNumber: '123456789'
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
    describe('because "vatNumber" is missing', () => {
      beforeEach(() => {
        delete payload.vatNumber
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter a VAT registration number',
          path: ['vatNumber'],
          type: 'any.required'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "vatNumber" is an empty string', () => {
      beforeEach(() => {
        payload.vatNumber = ''
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter a VAT registration number',
          path: ['vatNumber'],
          type: 'string.empty'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "vatNumber" is not 9 digits', () => {
      beforeEach(() => {
        payload.vatNumber = '1234'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter a VAT registration number, like 123456789',
          path: ['vatNumber'],
          type: 'string.pattern.base'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "vatNumber" contains letters', () => {
      beforeEach(() => {
        payload.vatNumber = 'ABC123XYZ'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter a VAT registration number, like 123456789',
          path: ['vatNumber'],
          type: 'string.pattern.base'
        }))
        expect(value).toEqual(payload)
      })
    })
  })
})
