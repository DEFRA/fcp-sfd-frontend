// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { addressesSchema } from '../../../../src/schemas/address/addresses-schema.js'

describe('addresses schema', () => {
  let payload
  let schema

  beforeEach(() => {
    schema = addressesSchema

    payload = {
      addresses: '100022950089, 14, New Business, Random Street, LONDON, E1 6AN'
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
    describe('because "addresses" is missing', () => {
      beforeEach(() => {
        delete payload.addresses
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Choose an address',
          path: ['addresses'],
          type: 'any.required'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "addresses" is an empty string', () => {
      beforeEach(() => {
        payload.addresses = ''
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Choose an address',
          path: ['addresses'],
          type: 'string.empty'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "addresses" is "display"', () => {
      beforeEach(() => {
        payload.addresses = 'display'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Choose an address',
          path: ['addresses'],
          type: 'any.invalid'
        }))
        expect(value).toEqual(payload)
      })
    })
  })
})
